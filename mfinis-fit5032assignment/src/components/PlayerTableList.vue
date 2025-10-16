<script setup>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { computed, ref } from 'vue';
import { InputText } from 'primevue';

const props = defineProps({players: Array, teamName: String});
const playerRows = computed(() => props.players.map(doc => doc.data));

const columns = [
  { field: 'position', header: 'Position' },
  { field: 'fullName', header: 'Name' },
  { field: 'nickname', header: 'Nickname' },
  { field: 'kicking', header: 'Kicking' },
  { field: 'handling', header: 'Handling' },
  { field: 'goalKicking', header: 'Goal Kicking' },
  { field: 'marking', header: 'Marking' },
  { field: 'pace', header: 'Pace' },
  { field: 'defending', header: 'Defending' },
  { field: 'strength', header: 'Strength' },
  { field: 'tackling', header: 'Tackling' },
];

const filters = ref({
  position:   { value: null, matchMode: 'contains' },
  fullName:   { value: null, matchMode: 'contains' },
  nickname:   { value: null, matchMode: 'contains' },
  kicking:    { value: null, matchMode: 'equals' },
  handling:   { value: null, matchMode: 'equals' },
  goalKicking:{ value: null, matchMode: 'equals' },
  marking:    { value: null, matchMode: 'equals' },
  pace:       { value: null, matchMode: 'equals' },
  defending:  { value: null, matchMode: 'equals' },
  strength:   { value: null, matchMode: 'equals' },
  tackling:   { value: null, matchMode: 'equals' },
})
</script>

<template>
  <div v-if="!props.players.length">Select a team to view players for.</div>
  <div v-else>
    <h3 class="py-3">Players for {{ props.teamName }}</h3>
    <DataTable :value="playerRows" v-model:filters="filters" filterDisplay="row" tableStyle="min-width: 50rem" showGridlines stripedRows removableSort paginator :rows="10" class="mb-3">
      <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header" sortable filter :showFilterMenu="false">
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" :placeholder="`Search by ${col.header}`" class="p-column-filter" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>
