"use client";

import { useState, useEffect } from "react";
import { useSettingsStore } from "@/store/settings";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Settings, Save, RefreshCw, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function EmailSettingsPage() {
    const { emailSettings, isLoading, error, fetchEmailSettings, updateEmailSettings, testEmailConnection } = useSettingsStore();
    const [formData, setFormData] = useState<any>({
        provider: 'smtp',
        smtp_server: '',
        smtp_port: 587,
        smtp_user: '',
        smtp_password: '',
    });
    const [isTesting, setIsTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

    useEffect(() => {
        fetchEmailSettings();
    }, [fetchEmailSettings]);

    useEffect(() => {
        if (emailSettings) {
            setFormData({
                provider: emailSettings.provider,
                smtp_server: emailSettings.smtp_server,
                smtp_port: emailSettings.smtp_port,
                smtp_user: emailSettings.smtp_user,
                smtp_password: '', // Never populate password from server
            });
        }
    }, [emailSettings]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToUpdate = { ...formData };
            if (!dataToUpdate.smtp_password) delete dataToUpdate.smtp_password;
            await updateEmailSettings(dataToUpdate);
        } catch (err) {
            // Error handled by store
        }
    };

    const handleTest = async () => {
        setIsTesting(true);
        setTestResult(null);
        const result = await testEmailConnection();
        setTestResult(result);
        setIsTesting(false);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <Mail size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-text-primary tracking-tight">Email Notifications</h1>
                    <p className="text-sm text-text-secondary font-medium">Configure organization-wide email delivery settings.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-none shadow-xl shadow-black/5 bg-white overflow-hidden">
                    <CardHeader className="border-b bg-gray-50/50 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-sm font-black uppercase tracking-widest text-text-primary">SMTP Configuration</CardTitle>
                                <CardDescription className="text-xs font-medium">Use your corporate SMTP relay.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1 bg-green-50 text-rag-green rounded border border-green-100">
                                <ShieldCheck size={12} />
                                <span className="text-[10px] font-black uppercase tracking-widest">AES-256 Encrypted</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">SMTP Host</Label>
                                    <Input
                                        value={formData.smtp_server}
                                        onChange={(e) => setFormData({ ...formData, smtp_server: e.target.value })}
                                        placeholder="smtp.gmail.com"
                                        className="h-10 text-sm font-medium focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Port</Label>
                                    <Input
                                        type="number"
                                        value={formData.smtp_port}
                                        onChange={(e) => setFormData({ ...formData, smtp_port: parseInt(e.target.value) })}
                                        className="h-10 text-sm font-medium focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Username / Email</Label>
                                <Input
                                    value={formData.smtp_user}
                                    onChange={(e) => setFormData({ ...formData, smtp_user: e.target.value })}
                                    placeholder="notifications@company.com"
                                    className="h-10 text-sm font-medium focus:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-400">Password / API Key</Label>
                                <Input
                                    type="password"
                                    value={formData.smtp_password}
                                    onChange={(e) => setFormData({ ...formData, smtp_password: e.target.value })}
                                    placeholder="••••••••••••••••"
                                    className="h-10 text-sm font-medium focus:ring-primary/20"
                                />
                                <p className="text-[10px] text-gray-400 font-medium">Leave blank to keep current password.</p>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-primary hover:bg-primary-hover text-white font-black uppercase tracking-[0.1em] text-xs h-10 px-6 gap-2 shadow-lg shadow-primary/20"
                                >
                                    <Save size={14} />
                                    {isLoading ? 'Saving...' : 'Save Settings'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleTest}
                                    disabled={isTesting}
                                    className="border-2 font-black uppercase tracking-[0.1em] text-xs h-10 px-6 gap-2"
                                >
                                    {isTesting ? <RefreshCw size={14} className="animate-spin" /> : <Settings size={14} />}
                                    Test Connection
                                </Button>
                            </div>

                            {testResult && (
                                <div className={cn(
                                    "p-3 rounded-lg border-2 flex items-center gap-3 animate-in slide-in-from-top-2",
                                    testResult.success ? "bg-green-50 border-green-200 text-rag-green" : "bg-red-50 border-red-200 text-rag-red"
                                )}>
                                    {testResult.success ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                                    <p className="text-xs font-black uppercase tracking-wider">{testResult.message}</p>
                                </div>
                            )}

                            {error && (
                                <div className="p-3 bg-red-50 border-2 border-red-200 text-rag-red rounded-lg flex items-center gap-3">
                                    <AlertCircle size={18} />
                                    <p className="text-xs font-black uppercase tracking-wider">{error}</p>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-none shadow-xl shadow-black/5 bg-primary text-white">
                        <CardHeader className="py-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest opacity-80">Provider Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs font-medium leading-relaxed opacity-90">
                                This configuration will be used to send all automated notifications including:
                            </p>
                            <ul className="space-y-2">
                                {['Approval Requests', 'Weekly Summaries', 'Risk Alerts'].map((item) => (
                                    <li key={item} className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl shadow-black/5 bg-white">
                        <CardHeader className="border-b py-4">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-text-primary">Status</CardTitle>
                        </CardHeader>
                        <CardContent className="py-6 flex flex-col items-center justify-center gap-4">
                            <div className={cn(
                                "w-16 h-16 rounded-full border-4 flex items-center justify-center",
                                emailSettings?.is_active ? "border-green-100 text-rag-green" : "border-gray-100 text-gray-300"
                            )}>
                                <CheckCircle size={32} />
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-black uppercase tracking-widest text-text-primary">
                                    {emailSettings?.is_active ? 'Service Active' : 'Service Inactive'}
                                </p>
                                <p className="text-[10px] text-text-secondary font-medium">
                                    Last synced: {emailSettings?.updated_at ? new Date(emailSettings.updated_at).toLocaleDateString() : 'Never'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
