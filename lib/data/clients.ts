export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  phone: string;
  address: string;
  status: 'Client' | 'Prospect';
  tags: string[];
  dateAdded: string; // format DD/MM/YYYY
}

export const initialClients: Client[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Martin',
    company: 'Wedding Corp',
    email: 'sarah.martin@example.com',
    phone: '0601020304',
    address: '12 rue des Fleurs, Paris',
    status: 'Client',
    tags: ['mariage', 'client-fidele'],
    dateAdded: '01/03/2024',
  },
  {
    id: '2',
    firstName: 'Marc',
    lastName: 'Dubois',
    company: 'StartupX',
    email: 'marc.dubois@example.com',
    phone: '0605060708',
    address: '5 avenue Victor Hugo, Lyon',
    status: 'Prospect',
    tags: ['startup', 'corporate'],
    dateAdded: '15/03/2024',
  },
  {
    id: '3',
    firstName: 'Julie',
    lastName: 'Rousseau',
    company: 'E-Shop',
    email: 'julie.rousseau@example.com',
    phone: '0611223344',
    address: '20 boulevard Alsace, Marseille',
    status: 'Client',
    tags: ['e-commerce'],
    dateAdded: '20/03/2024',
  },
];
