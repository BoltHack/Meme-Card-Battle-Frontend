import { ChangeEvent, useEffect, useState } from "react";

import styles from "../../CardRedaction/CreateCard/Card.CreateCard.module.css";
import admin_styles from "../../AdminPanel/Card.AdminPanel.module.css";

import axios from "axios";
axios.defaults.withCredentials = true;

import api from "../../../../api/api.ts";
import usePageRender from "../../../../tools/PageRender.ts";
import { ErrorPage } from "../../../ErrorPage/Error.tsx";
import { DefaultLoading } from "../../../LoadingPage/DefaultLoading.tsx";
import toast from "react-hot-toast";

interface CaseFormat {
  case_name: string;
  case_description: string;
  case_rarity: string;
  case_price: string;
}

interface ResponseProps {
  case_id: string;
  onBack: () => void;
}

export const EditContentPage = ({ onBack, case_id }: ResponseProps) => {
  const [formData, setFormData] = useState<CaseFormat>({
    case_name: "",
    case_description: "",
    case_rarity: "DEFAULT",
    case_price: "",
  });

  const { data, loading, error } = usePageRender(
    `${api.API_BASE_URL}/admin/case/${case_id}/edit`,
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMinusNumber = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "-" || e.key === "+") e.preventDefault();
  };

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = new FormData();

    dataToSend.append("name", formData.case_name);
    dataToSend.append("description", formData.case_description);
    dataToSend.append("rarity", formData.case_rarity);
    dataToSend.append("price", formData.case_price);

    try {
      const response = await axios.post(
        `${api.API_BASE_URL}/admin/case/${case_id}/edit`,
        dataToSend,
        {
          withCredentials: true,
        },
      );

      console.log("Новый кейс успешно создан:", response.data);

      setFormData({
        case_name: "",
        case_description: "",
        case_rarity: "DEFAULT",
        case_price: "",
      });

      toast.success(response.data.success);

      return response.data;
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    if (!data || !data.renderData) {
      console.log(
        "Данные еще не загрузились или структура не совпадает:",
        data,
      );
      return;
    }

    setFormData({
      case_name: data.renderData.name,
      case_description: data.renderData.description,
      case_rarity: data.renderData.rarity,
      case_price: data.renderData.price,
    });
  }, [data]);

  if (loading) return <DefaultLoading />;
  if (error) return <ErrorPage error={error} />;

  return (
    <div
      id="edit-content-page"
      className={`${admin_styles["page"]} ${admin_styles["active"]}`}
    >
      <header className={admin_styles["header"]}>
        <h1>Редактор содержимого</h1>
        <p>Изменение содержимого кейса.</p>
      </header>

      <a href="#" className={admin_styles["on-back"]} onClick={onBack}>
        ← Назад
      </a>

      
    </div>
  );
};
