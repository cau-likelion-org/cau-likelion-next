export interface RecruitPartQuota {
  partId: number;
  partName: string;
  quota: string;
}

export interface RecruitGenerationSetting {
  generation: string;
  partQuotas: RecruitPartQuota[];
}

export const RECRUIT_GENERATION_SETTING_MOCK: RecruitGenerationSetting = {
  generation: '',
  partQuotas: [
    { partId: 1, partName: '기획·디자인', quota: '' },
    { partId: 2, partName: '프론트엔드', quota: '' },
    { partId: 3, partName: '백엔드', quota: '' },
  ],
};
