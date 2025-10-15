import { hasRequiredFields } from '../utils';
import { OrderDirection, ReviewsOrderByColumns } from '../../../shared/constants.js';
import axios from 'axios';

export async function createVenue(data) {
  const { hasFields, errorMsg } = hasRequiredFields(data, ['name', 'location']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  await axios.post('/api/createVenue', {
    name: data.name,
    location: data.location,
  });
}

export async function getVenue(venueId) {
  const { hasFields, errorMsg } = hasRequiredFields({venueId}, ['venueId']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }

  const res = await axios.get('/api/getVenue', { params: { id: venueId } });
  return res.data;
}

export async function getAllVenues() {
  const res = await axios.get('/api/getAllVenues');
  return res.data.data;
}

export async function getVenueReviews(venueId, orderByColumn=ReviewsOrderByColumns.RATING, orderDirection=OrderDirection.DESC) {
  const { hasFields, errorMsg } = hasRequiredFields({venueId, orderByColumn, orderDirection}, ['venueId', 'orderByColumn', 'orderDirection']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }
  if (!Object.values(ReviewsOrderByColumns).includes(orderByColumn)) {
    throw new Error(`Invalid order by option: ${orderByColumn}`);
  }
  if (!Object.values(OrderDirection).includes(orderDirection)) {
    throw new Error(`Invalid order by direction: ${orderDirection}`);
  }

  const res = await axios.get('/api/getVenueReviews', {
    params: { venueId, orderByColumn, orderDirection }
  });
  return res.data.data;
}

export async function addReview(venueId, rating, content) {
  const { hasFields, errorMsg } = hasRequiredFields({venueId, rating, content}, ['venueId', 'rating', 'content']);
  if (!hasFields) {
    throw new Error(errorMsg);
  }
  if (typeof(rating) !== 'number' || rating < 1 || rating > 5) throw new Error('Rating must be between 1..5');

  await axios.post('/api/addReview', { venueId, rating, content });
}
