"use client";

import { useState } from "react";
import { AlertSettings, CompanySettings, Settings } from "@/lib/types/index.ts";
import { CompanyForm } from "@/components/sections/settings/CompanyForm.tsx";
import { saveSettingsAction } from "@/app/actions.ts";

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

  /**
   * Saves settings to the server using the safe action wrapper.
   */
  async function handleSave() {
    setSaved(false);
    try {
      const result = await saveSettingsAction({ ...company, ...alerts });
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error("Failed to save settings:", result.error);
        // Could display an error toast here
      }
    } catch (e) {
      console.error("Unexpected error saving settings", e);
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
    </div>
  );
}
