export async function FetchTopRatedMovies(page = 1) {
  const apiKey = import.meta.env.VITE_API_KEY;
  const topMoviesURL = import.meta.env.VITE_TOP_RATED_URL;

  try {
    const response = await fetch(
      `${topMoviesURL}?api_key=${apiKey}&page=${page}`
    );

    if (!response.ok) throw new Error("Failed to fetch Movies!");

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log(`Error while fetching movies: ${error}`);
    return [];
  }
}
