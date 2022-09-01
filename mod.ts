import { YouTube } from "https://deno.land/x/youtube@v0.3.0/mod.ts";
import "https://deno.land/x/dotenv/load.ts";

type RecommendMovie = {
  videoId: string;
};
const fetchRecommendMovie = async (query: string): Promise<RecommendMovie> => {
  const maxResults = 10;

  const youtubeApiKey = Deno.env.get("YOUTUBE_API_KEY");

  if (!youtubeApiKey) {
    throw new Error("YOUTUBE_API_KEY not found");
  }
  const youtubeApi = new YouTube(youtubeApiKey, false);
  const searchResults = await youtubeApi.search_list({
    part: "snippet",
    q: query,
    maxResults: maxResults,
  });
  const index = Math.floor(Math.random() * (maxResults + 1));
  return searchResults.items[index];
};

const main = async () => {
  const result = await fetchRecommendMovie("ボカロ");
  console.log(result);
};

await main();
