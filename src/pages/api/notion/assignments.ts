import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE_ID;
  const notionKey = process.env.NEXT_PUBLIC_NOTION_KEY;

  try {
    const response = await axios.post(
      `https://api.notion.com/v1/data_sources/${databaseId}/query`,
      {},
      {
        headers: {
          Authorization: `Bearer ${notionKey}`,
          'Notion-Version': '2026-03-11',
          'Content-Type': 'application/json',
        },
      },
    );

    const results = response.data.results.map((page: any) => {
      const props = page.properties;
      return {
        이름: props['이름']?.title?.[0]?.plain_text ?? '',
        트랙: props['트랙']?.select?.name ?? '',
        '과제 미제출': props['과제 미제출']?.number ?? 0,
        '과제 지각제출': props['과제 지각제출']?.number ?? 0,
      };
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Notion data' });
  }
}
