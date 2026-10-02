import type { Document } from '../models/Document';

export const documents: Document[] = [
  {
    id: 'doc-001',
    title: 'Procés DPF',
    description: 'Documentació relacionada amb el procés DPF.',
    fileName: 'proces-dpf.pdf',
    filePath: '/documents/proces-dpf.pdf',
    type: 'pdf',
    categoryId: 'ot-ip',
    tags: ['dpf', 'ot-ip'],
  },
  {
    id: 'doc-002',
    title: 'IPC-6012E',
    description: 'Norma IPC relacionada amb la fabricació de circuits impresos.',
    fileName: 'ipc-6012e.pdf',
    filePath: '/documents/ipc-6012e.pdf',
    type: 'pdf',
    categoryId: 'normes',
    tags: ['ipc', '6012e', 'normativa'],
  },
  {
    id: 'doc-003',
    title: 'Materials FR4',
    description: 'Informació general sobre materials FR4.',
    fileName: 'materials-fr4.docx',
    filePath: '/documents/materials-fr4.docx',
    type: 'docx',
    categoryId: 'materials',
    tags: ['fr4', 'materials'],
  },
  {
    id: 'doc-004',
    title: 'Norma client exemple',
    description: 'Exemple de requisits específics d’un client.',
    fileName: 'norma-client.doc',
    filePath: '/documents/norma-client.doc',
    type: 'doc',
    categoryId: 'normes-clients',
    tags: ['client', 'normativa'],
  },
];