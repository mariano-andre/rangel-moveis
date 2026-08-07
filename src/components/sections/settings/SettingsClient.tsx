"use client";

import { useState } from "react";
import { AlertSettings, CompanySettings, Settings } from "../../../lib/types/index.ts";
import { CompanyForm } from "./CompanyForm.tsx";
import { AlertsForm } from "./AlertsForm.tsx";
import { saveSettingsAction } from "../../../app/actions.ts";

interface SettingsClientProps {
  initialSettings: Settings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [company, setCompany] = useState<CompanySettings>(
    initialSettings.company,
  );
  const [alerts, setAlerts] = useState<AlertSettings>(initialSettings.alerts);
  const [saved, setSaved] = useState(false);

  function handleCompanyChange(
    key: keyof CompanySettings,
    value: string | number,
  ) {
    setCompany((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleAlertChange(key: keyof AlertSettings, value: boolean) {
    setAlerts((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaved(false);
    try {
      await saveSettingsAction({ company, alerts });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <CompanyForm
        data={company}
        onChange={handleCompanyChange}
        onSave={handleSave}
        saved={saved}
      />
      <AlertsForm
        data={alerts}
        onChange={handleAlertChange}
      />
    </div>
  );
}
