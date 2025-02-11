import { EventData, Page } from '@nativescript/core';
import { GameViewModel } from './game-view-model';

export function onNavigatingTo(args: EventData) {
    const page = <Page>args.object;
    page.bindingContext = new GameViewModel();
}