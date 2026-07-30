import { settingsMock } from "@/content/settings";
import { SettingsClient } from "@/components/sections/settings/SettingsClient";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-text-primary">Configurações</h1>
        <p className="text-sm text-text-muted mt-0.5">Dados da empresa e preferências</p>
      </div>
      <SettingsClient initialSettings={settingsMock} />
    </div>
  );
}
