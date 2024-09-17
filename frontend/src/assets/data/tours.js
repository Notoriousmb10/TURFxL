import tourImg01 from "../images/tour-img01.jpg";
import tourImg02 from "../images/tour-img02.jpg";
import tourImg03 from "../images/tour-img03.jpg";
import tourImg04 from "../images/tour-img04.jpg";
import tourImg05 from "../images/tour-img05.jpg";
import tourImg06 from "../images/tour-img06.jpg";
import tourImg07 from "../images/tour-img07.jpg";

const turfs = [
  {
    id: "01",
    title: "Borivali West Sports Turf",
    city: "Borivali",
    distance: 2,
    address: "Borivali West, Mumbai",
    price: 120,
    maxGroupSize: 15,
    desc: "A popular turf in Borivali West, perfect for football, cricket, and other group sports. Equipped with proper lighting and changing rooms.",
    reviews: [
      {
        name: "Raj Malhotra",
        rating: 4.9,
      },
      {
        name: "Sneha Desai",
        rating: 4.7,
      }
    ],
    avgRating: 4.8,
    photo: tourImg01, // Update with appropriate image for Borivali turf
    featured: true,
  },
  {
    id: "02",
    title: "Central Turf Arena",
    city: "Kandivali",
    distance: 10,
    address: "Shivaji Nagar, Pune",
    price: 100,
    maxGroupSize: 12,
    desc: "A well-maintained turf ideal for 7-a-side football and cricket matches.",
    reviews: [
      {
        name: "Sanjay Sharma",
        rating: 4.5,
      }
    ],
    avgRating: 4.5,
    photo: tourImg02,
    featured: true,
  },
  {
    id: "03",
    title: "Infinity Sports Turf",
    city: "Bandra",
    distance: 8,
    address: "MG Road, Bangalore",
    price: 130,
    maxGroupSize: 10,
    desc: "A top-quality artificial grass turf, suitable for both football and cricket, with parking facilities.",
    reviews: [],
    avgRating: 4.6,
    photo: tourImg03,
    featured: true,
  },
  {
    id: "04",
    title: "Sunrise Arena",
    city: "Chikoowadi",
    distance: 6,
    address: "Adyar, Chennai",
    price: 110,
    maxGroupSize: 12,
    desc: "A vibrant turf facility available for both day and night bookings, equipped with excellent floodlights.",
    reviews: [],
    avgRating: 4.4,
    photo: tourImg04,
    featured: true,
  },
  {
    id: "05",
    title: "Green Field Turf",
    city: "Malad",
    distance: 15,
    address: "Banjara Hills, Hyderabad",
    price: 140,
    maxGroupSize: 18,
    desc: "One of the most spacious turfs in Hyderabad, perfect for football and other group sports.",
    reviews: [],
    avgRating: 4.3,
    photo: tourImg05,
    featured: false,
  },
  {
    id: "06",
    title: "Champions Turf",
    city: "Mahavir Nagar",
    distance: 12,
    address: "Salt Lake, Kolkata",
    price: 125,
    maxGroupSize: 10,
    desc: "A small yet well-maintained turf, ideal for quick football matches.",
    reviews: [],
    avgRating: 4.4,
    photo: tourImg06,
    featured: false,
  },
  {
    id: "07",
    title: "Legends Arena",
    city: "Charkop",
    distance: 5,
    address: "Connaught Place, Delhi",
    price: 135,
    maxGroupSize: 20,
    desc: "A premium turf located in the heart of the city with excellent facilities.",
    reviews: [],
    avgRating: 4.6,
    photo: tourImg07,
    featured: false,
  },
  {
    id: "08",
    title: "Ocean View Turf",
    city: "Jogeshwari",
    distance: 2,
    address: "Calangute, Goa",
    price: 160,
    maxGroupSize: 10,
    desc: "A scenic turf overlooking the beach, perfect for playing football with a view.",
    reviews: [],
    avgRating: 4.7,
    photo: tourImg07,
    featured: false,
  },
];

export default turfs;

