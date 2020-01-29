export class HomePage {
    Name?: string;
    Items: HomePageItem[];
}

export class HomePageItem {
    Name: string;
    State: string;
    ColorBadge?: string = null;
    Count?: number = 0;
    Params?: any = null;
    Color?: string = null;
    Icon?: string = null;
    AccessLevel?: number = 0;
    Disabled?: boolean;
}