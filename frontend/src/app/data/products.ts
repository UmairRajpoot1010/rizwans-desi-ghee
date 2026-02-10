import bottle2 from '@/assets/bottle2.png';
import { Product } from '@/app/context/app-context';

export const products: Product[] = [
  {
    id: 1,
    name: 'Pure Cow Ghee',
    description: '100% pure cow ghee made from grass-fed cows',
    price: 450,
    weight: '500g',
    image: bottle2.src,
    rating: 4.8,
    reviews: 245,
    benefits: ['Rich in Vitamins A, D, E, K2', 'Supports digestion', 'Anti-inflammatory'],
    ingredients: ['Pure cow butter'],
    inStock: true
  },
  {
    id: 2,
    name: 'Buffalo Ghee',
    description: 'Premium buffalo ghee with rich, creamy taste',
    price: 520,
    weight: '500g',
    image: bottle2.src,
    rating: 4.7,
    reviews: 189,
    benefits: ['Higher in butyric acid', 'Better for lactose intolerant', 'Cooling properties'],
    ingredients: ['Pure buffalo butter'],
    inStock: true
  },
  {
    id: 3,
    name: 'Bilona Ghee',
    description: 'Traditionally churned ghee using ancient Bilona method',
    price: 650,
    weight: '500g',
    image: bottle2.src,
    rating: 4.9,
    reviews: 312,
    benefits: ['Highest nutritional value', 'No additives', 'Authentic taste'],
    ingredients: ['Pure milk cream'],
    inStock: true
  },
  {
    id: 4,
    name: 'Flavored Ghee - Turmeric',
    description: 'Ghee infused with turmeric and black pepper',
    price: 580,
    weight: '500g',
    image: bottle2.src,
    rating: 4.6,
    reviews: 156,
    benefits: ['Anti-inflammatory', 'Immunity booster', 'Joint support'],
    ingredients: ['Cow ghee', 'Turmeric', 'Black pepper'],
    inStock: true
  },
  {
    id: 5,
    name: 'Organic A2 Ghee',
    description: 'Ghee from A2 milk cows - easier to digest',
    price: 750,
    weight: '500g',
    image: bottle2.src,
    rating: 4.8,
    reviews: 201,
    benefits: ['A2 protein only', 'Better gut health', 'Natural immunity'],
    ingredients: ['A2 cow milk butter'],
    inStock: true
  },
  {
    id: 6,
    name: 'Herb Infused Ghee',
    description: 'Ghee blended with Ayurvedic herbs',
    price: 620,
    weight: '500g',
    image: bottle2.src,
    rating: 4.7,
    reviews: 134,
    benefits: ['Ayurvedic herbs blend', 'Energy booster', 'Mental clarity'],
    ingredients: ['Ghee', 'Ashwagandha', 'Brahmi', 'Shatavari'],
    inStock: true
  }
];
