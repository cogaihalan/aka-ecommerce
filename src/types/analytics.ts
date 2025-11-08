export interface OverviewData {
    activeUsers: string;
    pageViews: string;
    avgSessionDuration: string;
    bounceRate: string;
    sessions: string;
    newUsers: string;
}

export interface VisitorData {
    date: string;
    activeUsers: number;
    newUsers: number;
    sessions: number;
}

export interface PageData {
    path: string;
    title: string;
    pageViews: number;
    activeUsers: number;
    avgSessionDuration: number;
    bounceRate: number;
}

export interface ReferrerData {
    source: string;
    medium: string;
    sessions: number;
    activeUsers: number;
    bounceRate: number;
}