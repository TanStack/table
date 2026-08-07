<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/components/theme-provider'

const { setTheme } = useTheme()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="icon" class="relative">
        <Sun
          class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        />
        <Moon
          class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="setTheme('light')">Light</DropdownMenuItem>
      <DropdownMenuItem @click="setTheme('dark')">Dark</DropdownMenuItem>
      <DropdownMenuItem @click="setTheme('system')">System</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
