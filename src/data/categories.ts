import type { Category } from '../models/Category';

export const categories: Category[] = [
  {
    id: 'ot-ip',
    name: "OT-IP's",
    description: 'Documentació relacionada amb OT-IP',
  },
  {
    id: 'ot-ip-dpf',
    name: 'DPF',
    parentId: 'ot-ip',
  },
  {
    id: 'ot-ip-coure',
    name: 'Coure',
    parentId: 'ot-ip',
  },
  {
    id: 'ot-ip-mascara',
    name: 'Màscara',
    parentId: 'ot-ip',
  },
  {
    id: 'ot-ip-marcatge',
    name: 'Marcatge',
    parentId: 'ot-ip',
  },
  {
    id: 'ot-ip-mecanitzat',
    name: 'Mecanitzat',
    parentId: 'ot-ip',
  },
  {
    id: 'ot-ip-test-electric',
    name: 'Test elèctric',
    parentId: 'ot-ip',
  },
  {
    id: 'normes',
    name: 'Normes',
    description: 'Normes IPC, UL i altres estàndards',
  },
  {
    id: 'materials',
    name: 'Materials',
    description: 'Documentació relacionada amb materials',
  },
  {
    id: 'normes-clients',
    name: 'Normes Clients',
    description: 'Normes i requisits específics de clients',
  },
];