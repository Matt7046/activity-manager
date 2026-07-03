"use client";
import { HttpStatus } from "@/general/structure/Constant";
import { Trans, useLingui } from "@lingui/react";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertConfig } from "../../components/ms-alert/Alert";
import { getDateStringExtendsFormat, showMessage, UserI } from "../../general/structure/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { getLogActivityByEmail } from "../page-activity/service/LogActivityService";
import { FamilyLogI } from "../page-family/Family";
import { getLogFamilyByEmail } from "../page-family/service/FamilyService";
import "./UserPointLogContent.css";

interface LogUserPointContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical: boolean;
}

const LogUserPointContent: React.FC<LogUserPointContentProps> = ({ user, alertConfig }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const { i18n } = useLingui();
  void i18n;

  const [logsActivity, setLogsActivity] = useState<ActivityLogI[]>([]);
  const [logsFamily, setLogsFamily] = useState<FamilyLogI[]>([]);
  const [loading, setLoading] = useState(true);
  void loading;

  useEffect(() => {
    if (type === "activity") {
      fetchActivityLogs();
    } else {
      fetchFamilyLogs();
    }
  }, [type]);

  const fetchActivityLogs = () => {
    getLogActivityByEmail(
      { ...user, email: user.emailChild, page: 0, size: 50, field: "date", unpaged: true },
      () => showMessage(alertConfig.setOpen, alertConfig.setMessage)
    ).then((response) => {
      if (response?.status === HttpStatus.OK) {
        setLogsActivity(response.jsonText);
      }
      setLoading(false);
    });
  };

  const fetchFamilyLogs = () => {
    getLogFamilyByEmail(
      { ...user, email: user.emailChild, page: 0, size: 50, field: "date", unpaged: true },
      () => showMessage(alertConfig.setOpen, alertConfig.setMessage)
    ).then((response) => {
      if (response?.status === HttpStatus.OK) {
        setLogsFamily(response.jsonText);
      }
      setLoading(false);
    });
  };

  return (
    <div className="points-content-container">
      <div className="log-header-bar flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="log-title-text text-xl font-semibold">
          {type === "activity" ? <Trans id="log_attivita" /> : <Trans id="log_famiglia" />}
        </h1>
      </div>

      {type === "activity" ? (
        <div className="log-scroll-container">
          {logsActivity.length > 0 ? (
            logsActivity.map((item, index) => (
              <div className="log-card-scroll-item" key={index}>
                <Card className="log-card-item border border-[var(--color-border)] shadow-none">
                  <CardContent className="log-card-content p-4">
                    <p className="log-label text-xs font-semibold uppercase">
                      <Trans id="data_operazione" />
                    </p>
                    <p className="log-value">{getDateStringExtendsFormat(item.date)}</p>
                    <p className="log-label text-xs font-semibold uppercase">
                      <Trans id="punti" />
                    </p>
                    <p className="log-value">
                      <span className="points-badge">{item.usePoints}</span>
                    </p>
                    <div className="log-card-footer mt-3">
                      <p className="log-label text-xs font-semibold uppercase">
                        <Trans id="descrizione" />
                      </p>
                      <p className="log-footer-text log-footer-text-italic">{item.log}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <p>
              <Trans id="nessuna_attivita_registrata" />
            </p>
          )}
        </div>
      ) : (
        <div className="log-scroll-container">
          {logsFamily.length > 0 ? (
            logsFamily.map((item, index) => (
              <div className="log-card-scroll-item" key={index}>
                <Card className="log-card-item border border-[var(--color-border)] shadow-none">
                  <CardContent className="log-card-content p-4">
                    <p className="log-label text-xs font-semibold uppercase">
                      <Trans id="data" />
                    </p>
                    <p className="log-value">{getDateStringExtendsFormat(item.date)}</p>
                    <p className="log-label text-xs font-semibold uppercase">
                      <Trans id="operazione" />
                    </p>
                    <p className="log-value">
                      <span
                        className={
                          item.operations === "FAMILY_REMOVE"
                            ? "log-value-highlight-red"
                            : "log-value-highlight"
                        }
                      >
                        {item.operations}
                      </span>
                    </p>
                    <p className="log-label text-xs font-semibold uppercase">
                      <Trans id="punti" />
                    </p>
                    <p className="log-value">
                      <span className="log-value-highlight">{Math.abs(item.usePoints || 0)}</span>
                    </p>
                    <div className="log-card-footer mt-3">
                      <p className="log-label text-xs font-semibold uppercase">
                        <Trans id="eseguito_da_a" />
                      </p>
                      <p className="log-footer-text">
                        <strong>Da:</strong> {item.performedByEmail}
                      </p>
                      <p className="log-footer-text">
                        <strong>A:</strong> {item.receivedByEmail}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          ) : (
            <p>
              <Trans id="nessun_log_familiare_trovato" />
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LogUserPointContent;
