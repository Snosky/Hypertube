export class Episode {
    episode_id: string;
    show_id: string;
    season: number;
    episode: number;
    description_full: string;
    title: string;
    first_aired: string;
    torrents: Array<any>;
    seen: boolean;
}
