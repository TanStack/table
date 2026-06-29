import { pageTitle } from 'ember-page-title';

const greeting = 'hello';

<template>
  {{pageTitle "Demo App"}}

  <h1>Welcome to ember!</h1>

  {{greeting}}, world!
</template>
