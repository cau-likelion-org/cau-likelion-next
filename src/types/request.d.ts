export type MemberStack = 'pm' | 'frontend' | 'backend' | 'design';

export type ShareURL = 'github' | 'youtube' | 'web';

export interface IShareURL {
  type: ShareURL;
  src: string;
}

interface IProject {
  id: string;
  title: string;
  generation: number;
}

interface IProjectDetail extends IProject {
  dev_stack: number[];
  subtitle: string;
  thumbnail: string;
  team_name: string;
  team_member: Record<MemberStack, string[]>;
  date: string;
  description: string;
  link: IShareURL[];
}
