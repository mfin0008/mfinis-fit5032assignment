import { doc, getDoc, collection, getDocs, addDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import db from '../init';
import { hasRequiredFields, OrderDirection } from '../utils';

const venueColumn = 'venues';
const reviewsColumn = 'reviews';

export const ReviewsOrderByColumns = Object.freeze({
  RATING: 'rating'
});

export async function createVenue(data) {
  const { hasFields, errorMsg } = hasRequiredFields(data, ['name', 'location']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  return await addDoc(collection(db, venueColumn), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function getVenue(venueId) {
  const venue = await getDoc(doc(db, venueColumn, venueId));
  if (!venue.exists) throw new Error(`Venue ${venueId} not found.`);
  return venue.data();
}

export async function getAllVenues() {
  const venuesSnapshot = await getDocs(collection(db, venueColumn));
  return venuesSnapshot.docs.map(doc => ({id: doc.id, data: doc.data()}));
}

export async function getVenueReviews(venueId, orderByColumn=ReviewsOrderByColumns.RATING, orderDirection=OrderDirection.DESC) {
  const reviewQuery = query(collection(db, venueColumn, venueId, reviewsColumn), orderBy(orderByColumn, orderDirection));
  const venueSnapshop = await getDocs(reviewQuery);
  return venueSnapshop.docs.map(doc => ({id: doc.id, data: doc.data()}));
}

export async function addReview(venueId, rating, content) {
  if (!venueId) throw new Error('Must provide a venue ID.');
  if (typeof(rating) !== 'number' || rating < 1 || rating > 5) throw new Error('Rating must be between 1..5');
  await getVenue(venueId); // check that the venue exists

  const venueRef = doc(db, venueColumn, venueId);

  await addDoc(collection(venueRef, reviewsColumn), {
    rating,
    content,
    createdAt: serverTimestamp(),
  });
}
