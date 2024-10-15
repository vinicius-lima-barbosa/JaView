export async function FetchMovies(page = 1) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const BASE_URL = import.meta.env.VITE_URL;

  try {
    const response = await fetch(
      `${BASE_URL}popular?api_key=${apiKey}&language=en-US&page=${page}`
    );

    if (!response.ok) throw new Error("Failed to fetch Movies!");

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(`Error while fetching movies: ${error}`);
    return [];
  }
}
