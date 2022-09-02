import { YouTube } from "https://deno.land/x/youtube@v0.3.0/mod.ts";
import { LineApi, SendBroadcastMessageRequest } from "./lineApi.ts";
import "https://deno.land/x/dotenv/load.ts";

type RecommendMovie = {
  id: {
    kind: string;
    videoId: string;
  };
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

  const videoUrl = generateYoutubeVideoUrl(result.id.videoId);

  const request: SendBroadcastMessageRequest = {
    messages: [
      {
        type: "text",
        text: "おすすめ動画はこちら！",
      },
      {
        type: "text",
        text: videoUrl,
      },
    ],
  };

  const channelSecret = Deno.env.get("CHANNEL_SECRET");
  const channelAccessToken = Deno.env.get("CHANNEL_ACCESS_TOKEN");

  if (!channelSecret || !channelAccessToken) throw new Error("Token not found");

  const lineApi = new LineApi(channelSecret, channelAccessToken);

  const response = await lineApi.sendBroadcastMessage(request);
};

const generateYoutubeVideoUrl = (videoId: string) => {
  return `https://youtube.com/watch?v=${videoId}`;
};

await main();
