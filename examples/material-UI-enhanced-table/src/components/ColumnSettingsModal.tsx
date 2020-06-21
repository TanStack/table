import React, { FC } from "react";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Modal from "@material-ui/core/Modal";
import Close from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
  DraggableLocation,
  DraggingStyle
} from "react-beautiful-dnd";
import { Column } from "react-table";
import { ColumnData, ModalProps } from "fraud-profiling";

const getModalStyle = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      position: "absolute",
      width: 600,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3)
    },
    root: {
      margin: "auto"
    }
  })
);

const ColumnSettingsModal: FC<ModalProps> = ({
  columns,
  closeModalHandler,
  open,
  saveSettings
}) => {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [hiddenColumns, setHiddenColumns] = React.useState<
    Column<ColumnData>[]
  >(columns.filter((col: Column) => !col.isVisible));
  const [columnOrder, setColumnOrder] = React.useState<Column<ColumnData>[]>(
    columns
  );
  const def = {
    columnOrder: columnOrder,
    hiddenColumns: hiddenColumns
  };

  const handleClose = () => {
    closeModalHandler(false);
  };

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle
  ) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: 8 * 2,
    margin: `0 0 8px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
  });
  const reorder = (
    list: Column<ColumnData>[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (
    source: DraggableLocation,
    destination: DraggableLocation,
    droppableSource: DraggableLocation,
    droppableDestination: DraggableLocation
  ) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: DropResult = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        columnOrder,
        result.source.index,
        result.destination.index
      );

      setColumnOrder(items);
    } else {
      const res = move(
        def[source.droppableId],
        def[destination.droppableId],
        source,
        destination
      );
      setColumnOrder(res.columnOrder);
      setHiddenColumns(res.hiddenColumns);
    }
  };

  const renderRow = (data: Column<ColumnData>[]) => {
    return data.map((item: Column<ColumnData>, index: number) => (
      <Draggable key={item.id} draggableId={item.id} index={index}>
        {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}
          >
            {item && <div>{item.Header}</div>}
          </ListItem>
        )}
      </Draggable>
    ));
  };

  const onClickHandler = () => {
    const order = columnOrder.map(col => col.id);
    const hide = hiddenColumns.map(col => col.id);
    saveSettings(hide, order);
  };

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: 8,
    width: 250,
    minHeight: 400
  });

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div style={modalStyle} className={classes.paper}>
        <IconButton
          style={{ position: "absolute", right: 0 }}
          aria-label="close"
          onClick={handleClose}
        >
          <Close />
        </IconButton>
        <h2 id="simple-modal-title">Select columns to hide</h2>
        <Grid
          container
          spacing={2}
          justify="center"
          alignItems="center"
          className={classes.root}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Grid item xs={6}>
              <Droppable droppableId="columnOrder">
                {(
                  provided: DroppableProvided,
                  snapshot: DroppableStateSnapshot
                ) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    <List dense component="div" role="list">
                      {renderRow(columnOrder)}
                    </List>
                    <div>{provided.placeholder}</div>
                  </div>
                )}
              </Droppable>
            </Grid>
            <Grid item xs={6}>
              <Droppable droppableId="hiddenColumns">
                {(
                  provided: DroppableProvided,
                  snapshot: DroppableStateSnapshot
                ) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    <List dense component="div" role="list">
                      {renderRow(hiddenColumns)}
                    </List>
                    <div>{provided.placeholder}</div>
                  </div>
                )}
              </Droppable>
            </Grid>
          </DragDropContext>
        </Grid>
        <Button aria-label="hide" onClick={onClickHandler} color="primary">
          <SaveIcon />
          Save settings
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </div>
    </Modal>
  );
};

export default ColumnSettingsModal;
