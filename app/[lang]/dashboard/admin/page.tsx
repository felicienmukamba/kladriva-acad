"use client";

import React from "react";
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Award,
  ArrowUpRight,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

const stats = [
  { label: "Utilisateurs actifs", value: "2,543", icon: Users, change: "+12%", color: "text-blue-500" },
  { label: "Cours complétés", value: "842", icon: CheckCircle, change: "+18%", color: "text-green-500" },
  { label: "Certificats émis", value: "1,205", icon: Award, change: "+5%", color: "text-purple-500" },
  { label: "Revenus (Mensuel)", value: "$45,200", icon: DollarSign, change: "+24%", color: "text-primary" },
];

const chartData = [
  { name: "Jan", users: 400, revenue: 2400 },
  { name: "Feb", users: 600, revenue: 3600 },
  { name: "Mar", users: 800, revenue: 5400 },
  { name: "Apr", users: 1200, revenue: 8200 },
  { name: "May", users: 1500, revenue: 10500 },
  { name: "Jun", users: 2100, revenue: 14000 },
];

const recentActivity = [
  { id: 1, user: "Sophie Martin", action: "a terminé le cours", target: "Architecture Docker", time: "Il y a 5 min" },
  { id: 2, user: "Marc Dubois", action: "a rejoint la formation", target: "Next.js Full-Stack", time: "Il y a 12 min" },
  { id: 3, user: "Léa Garcia", action: "a obtenu la certification", target: "AWS Cloud Expert", time: "Il y a 45 min" },
  { id: 4, user: "Thomas Müller", action: "a réservé un mentor", target: "Félicien Mukamba", time: "Il y a 1h" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble Admin</h1>
          <p className="text-muted-foreground mt-1">Gérez vos utilisateurs, vos cours et analysez les performances de la plateforme.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl">Exporter les données</Button>
          <Button className="rounded-xl gap-2">
            <UserPlus className="w-4 h-4" /> Nouvel Utilisateur
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/50 backdrop-blur-xl rounded-2xl shadow-apple transition-all hover:shadow-apple-lg overflow-hidden relative group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-12 h-12" />
             </div>
             <CardHeader className="pb-2">
               <CardDescription className="text-xs uppercase tracking-wider font-bold">{stat.label}</CardDescription>
               <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="flex items-center gap-1.5 text-xs font-medium text-green-500">
                 <TrendingUp className="w-3 h-3" />
                 {stat.change} <span className="text-muted-foreground font-normal ml-1">vs mois dernier</span>
               </div>
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur-xl rounded-2xl shadow-apple overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Croissance des revenus & Utilisateurs</CardTitle>
            <CardDescription>Performance semestrielle de la plateforme.</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px] pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#888" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "rgba(255,255,255,0.9)", border: "none", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  cursor={{ fill: "rgba(0,0,0,0.02)" }}
                />
                <Bar dataKey="revenue" fill="oklch(0.45 0.2 270)" radius={[6, 6, 0, 0]} barSize={40} />
                <Bar dataKey="users" fill="oklch(0.55 0.18 270 / 0.3)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-xl rounded-2xl shadow-apple overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Activité récente</CardTitle>
              <Activity className="w-4 h-4 text-primary" />
            </div>
            <CardDescription>Dernières actions sur la plateforme.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-bold">{activity.user}</span> {activity.action} <span className="font-semibold text-primary">{activity.target}</span>
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs text-primary hover:bg-primary/5 rounded-xl">
                Voir tous les logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions / Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="apple-card border-none bg-gradient-to-br from-primary to-indigo-700 text-white">
            <CardHeader>
               <CardTitle className="text-white">Gérer le Catalogue</CardTitle>
               <CardDescription className="text-white/70">Ajoutez de nouveaux cours ou modifiez les parcours existants.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="secondary" className="w-full rounded-xl">Accéder aux Cours</Button>
            </CardContent>
         </Card>
         <Card className="apple-card border-none bg-slate-900 text-white">
            <CardHeader>
               <CardTitle className="text-white">Vérification Certificats</CardTitle>
               <CardDescription className="text-white/70">Validez les demandes d'émission ou révoquez des certificats.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="secondary" className="w-full rounded-xl">Gérer les Certificats</Button>
            </CardContent>
         </Card>
         <Card className="apple-card border-none bg-teal-600 text-white">
            <CardHeader>
               <CardTitle className="text-white">Support Mentorat</CardTitle>
               <CardDescription className="text-white/70">Intervenez dans les tickets SOS ou modifiez les réservations.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="secondary" className="w-full rounded-xl">Voir les Sessions</Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
