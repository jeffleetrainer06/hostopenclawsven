export interface CustomerTool {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
  category: 'buying' | 'trade-in' | 'accessories' | 'finance' | 'service';
  isFavorite?: boolean;
}

export const customerTools: CustomerTool[] = [
  {
    id: 'smartpath',
    name: 'SmartPath',
    url: 'https://smartpath.pedersentoyota.com/how-it-works?dealerCd=05030&source=t3&zipcode=80525',
    icon: '🛒',
    description: 'Online buying tool - explore payment options, value trade-in, complete purchase from home',
    category: 'buying',
    isFavorite: true,
  },
  {
    id: 'trade-in-appraisal',
    name: 'Trade-In Appraisal Tool',
    url: 'https://www.kbb.com/instant-cash-offer/',
    icon: '💰',
    description: 'Get an instant trade-in value for your current vehicle',
    category: 'trade-in',
    isFavorite: true,
  },
  {
    id: 'toyota-configurator',
    name: 'Toyota Configurator',
    url: 'https://www.toyota.com/configurator/?bap_guid=d60215aa-72b4-419f-b5b9-c81407453f4e',
    icon: '🎨',
    description: 'Build and customize your perfect Toyota - colors, packages, and accessories',
    category: 'buying',
  },
  {
    id: 'pedersen-accessories',
    name: 'Pedersen Toyota Accessories',
    url: 'https://accessories.pedersentoyota.com',
    icon: '🎁',
    description: 'Shop genuine Toyota accessories and parts',
    category: 'accessories',
  },
  {
    id: 'affordability-calculator',
    name: 'How Much Car Can I Afford',
    url: 'https://www.pedersentoyota.com/finance/payment-calculator',
    icon: '🧮',
    description: 'Calculate monthly payments and see what fits your budget',
    category: 'finance',
  },
];

export const getFavoriteTools = () => 
  customerTools.filter(tool => tool.isFavorite);

export const getToolsByCategory = (category: string) =>
  customerTools.filter(tool => tool.category === category);

export const getToolById = (id: string) =>
  customerTools.find(tool => tool.id === id);
