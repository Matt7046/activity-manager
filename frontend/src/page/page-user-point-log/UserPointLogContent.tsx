"use client";
import { HttpStatus } from "@/general/structure/Constant";
import { Trans, useLingui } from "@lingui/react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { AlertConfig } from '../../components/ms-alert/Alert';
import { getDateStringExtendsFormat, showMessage, UserI } from "../../general/structure/Utils";
import { ActivityLogI } from "../page-activity/Activity";
import { getLogActivityByEmail } from '../page-activity/service/LogActivityService';
import { FamilyLogI } from '../page-family/Family';
import { getLogFamilyByEmail } from '../page-family/service/FamilyService';
import "./UserPointLogContent.css";

interface LogUserPointContentProps {
  user: UserI;
  alertConfig: AlertConfig;
  isVertical:boolean;
}

const LogUserPointContent: React.FC<LogUserPointContentProps> = ({ user, alertConfig }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // 'activity' o 'family'
  const { i18n } = useLingui();

  const [logsActivity, setLogsActivity] = useState<ActivityLogI[]>([]);
  const [logsFamily, setLogsFamily] = useState<FamilyLogI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (type === 'activity') {
      fetchActivityLogs();
    } else {
      fetchFamilyLogs();
    }
  }, [type]);

  const fetchActivityLogs = () => {
    getLogActivityByEmail({ 
        ...user, 
        email: user.emailChild, 
        page: 0, size: 50, field: 'date', unpaged: true 
    }, () => showMessage(alertConfig.setOpen, alertConfig.setMessage))
    .then((response) => {
      if (response?.status === HttpStatus.OK) {
        setLogsActivity(response.jsonText);
      }
      setLoading(false);
    });
  };

  const fetchFamilyLogs = () => {
    getLogFamilyByEmail({ 
        ...user, 
        email: user.emailChild, 
        page: 0, size: 50, field: 'date', unpaged: true 
    }, () => showMessage(alertConfig.setOpen, alertConfig.setMessage))
    .then((response) => {
      if (response?.status === HttpStatus.OK) {
        setLogsFamily(response.jsonText);
      }
      setLoading(false);
    });
  };

  return (
    <Box className="points-content-container">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" className="log-title-text">
          {type === 'activity' ? <Trans id="log_attivita" /> : <Trans id="log_famiglia" />}
        </Typography>
      </Box>

      {type === 'activity' ? (
        <div className="log-scroll-container">
          {logsActivity.length > 0 ? logsActivity.map((item, index) => (
            <div className="log-card-scroll-item" key={index}>
              <Card className="log-card-item" elevation={0}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography className="log-label"><Trans id="data_operazione" /></Typography>
                  <Typography className="log-value">{getDateStringExtendsFormat(item.date)}</Typography>
                  <Typography className="log-label"><Trans id="punti" /></Typography>
                  <Typography className="log-value"><span className="points-badge">{item.usePoints}</span></Typography>
                  <div className="log-card-footer">
                    <Typography className="log-label"><Trans id="descrizione" /></Typography>
                    <Typography className="log-footer-text" sx={{ fontStyle: 'italic' }}>{item.log}</Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          )) : <Typography><Trans id="nessuna_attivita_registrata" /></Typography>}
        </div>
      ) : (
        <div className="log-scroll-container">
          {logsFamily.length > 0 ? logsFamily.map((item, index) => (
            <div className="log-card-scroll-item" key={index}>
              <Card className="log-card-item" elevation={0}>
                <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography className="log-label"><Trans id="data" /></Typography>
                  <Typography className="log-value">{getDateStringExtendsFormat(item.date)}</Typography>
                  <Typography className="log-label"><Trans id="operazione" /></Typography>
                  <Typography className="log-value">
                    <span className={item.operations === 'FAMILY_REMOVE' ? "log-value-highlight-red" : "log-value-highlight"}>
                        {item.operations}
                    </span>
                  </Typography>
                  <Typography className="log-label"><Trans id="punti" /></Typography>
                  <Typography className="log-value">
                    <span className="log-value-highlight">{Math.abs(item.usePoints || 0)}</span>
                  </Typography>
                  <div className="log-card-footer">
                    <Typography className="log-label"><Trans id="eseguito_da_a" /></Typography>
                    <Typography className="log-footer-text"><strong>Da:</strong> {item.performedByEmail}</Typography>
                    <Typography className="log-footer-text"><strong>A:</strong> {item.receivedByEmail}</Typography>
                  </div>
                </CardContent>
              </Card>
            </div>
          )) : <Typography><Trans id="nessun_log_familiare_trovato" /></Typography>}
        </div>
      )}
    </Box>
  );
};

export default LogUserPointContent;
