import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import api from "../api/api";
import useContentRender from "./ContentRender";

interface LinksPost {
  id: string;
  name: string;
  link: string;
  icon: string;
  priority: number;
}

export const PublicPanel = () => {
  const [links, setLinks] = useState<LinksPost[]>([]);

  const { contentData } = useContentRender(`${api.API_BASE_URL}/api/getData`);

  useEffect(() => {
    if (!contentData || !contentData.renderData) return;

    setLinks(contentData?.renderData);
  }, [contentData]);

  return <Outlet context={{ footerLinks: links }} />;
};
