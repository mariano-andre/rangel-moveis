"use client";

import { useState } from "react";
import { Settings, CompanySettings, AlertSettings } from "@/lib/types";
import { CompanyForm } from "@/components/sections/settings/CompanyForm";
import { AlertsForm } from "@/components/sections/settings/AlertsForm";

interface SettingsClientProps {
  initialSettings: Settings;
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [company, setCompany] = useState<CompanySettings>(initialSettings.company);
  const [alerts,  setAlerts]  = useState<AlertSettings>(initialSettings.alerts);
  const [saved,   setSaved]   = useState(false);

  function handleCompanyChange(key: keyof CompanySettings, value: string | number) {
    setCompany((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleAlertChange(key: keyof AlertSettings, value: boolean) {
    setAlerts((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    // futuramente: POST /api/settings com { company, alerts }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
