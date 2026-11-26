import { useState } from 'react';

import { ApplicantDetail, SUBMISSION_STATUS_LABEL } from './applicantMock';

export const ALL = '전체';

interface ApplicantFilterOptions {
  pageSize: number;
  getResultLabel: (applicant: ApplicantDetail) => string | undefined;
}

const useApplicantFilter = (applicants: ApplicantDetail[], { pageSize, getResultLabel }: ApplicantFilterOptions) => {
  const [statusFilter, setStatusFilter] = useState(ALL);
  const [partFilter, setPartFilter] = useState(ALL);
  const [resultFilter, setResultFilter] = useState(ALL);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(1);

  const trimmedKeyword = keyword.trim();
  const filtered = applicants.filter((applicant) => {
    if (statusFilter !== ALL && SUBMISSION_STATUS_LABEL[applicant.submissionStatus] !== statusFilter) return false;
    if (partFilter !== ALL && applicant.part !== partFilter) return false;
    if (resultFilter !== ALL && getResultLabel(applicant) !== resultFilter) return false;
    if (trimmedKeyword && !applicant.name.includes(trimmedKeyword) && !applicant.studentId?.includes(trimmedKeyword))
      return false;
    return true;
  });

  const totalPage = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPage);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const withPageReset = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return {
    statusFilter,
    partFilter,
    resultFilter,
    keyword,
    changeStatusFilter: withPageReset(setStatusFilter),
    changePartFilter: withPageReset(setPartFilter),
    changeResultFilter: withPageReset(setResultFilter),
    changeKeyword: withPageReset(setKeyword),
    filtered,
    pageItems,
    currentPage,
    totalPage,
    setPage,
  };
};

export default useApplicantFilter;
