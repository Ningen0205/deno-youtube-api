import "https://deno.land/x/dotenv/load.ts";

export type Message = {
  type: string;
  text: string;
};

export type SendBroadcastMessageRequest = {
  messages: Message[];
};

export interface ILineApi {
  sendBroadcastMessage(messages: Message[]): Promise<any>;
}

export class LineApi {
  private baseUrl = "https://api.line.me";

  constructor(
    private channelSecret: string,
    private channelAccessToken: string
  ) {}

  async sendBroadcastMessage(body: SendBroadcastMessageRequest): Promise<any> {
    const url = `${this.baseUrl}/v2/bot/message/broadcast`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.channelAccessToken}`,
      },
      body: JSON.stringify(body),
    });

    return response.json();
  }
}
