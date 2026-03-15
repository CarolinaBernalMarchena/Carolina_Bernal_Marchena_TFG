import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Api, MOCK_BOXES_OPENED, Trade } from '../../services/api';

@Component({
  selector: 'app-special-trade-card',
  imports: [],
  templateUrl: './special-trade-card.html',
  styleUrl: './special-trade-card.scss',
})
export class SpecialTradeCard {

  @Input({ required: true }) trade!: Trade;
  @Output() tradeEnded = new EventEmitter<void>();

  endTrade() {
    this.tradeEnded.emit();
  }
  constructor(private api: Api) {}
  
  getBoxImage(boxId: number): string {
    const box = MOCK_BOXES_OPENED.find(b => b.id === boxId);
    return box ? box.imageUrl : '';
  }

  acceptTrade(trade: Trade) {
    const currentUser = this.api.getCurrentUser();

    this.api.acceptTrade(trade.id).subscribe(() => {

      //Añadimos la caja ofrecida al que acepta
      this.api.addCollectibleToUser(
        trade.offeredBoxId,
        currentUser.id
      ).subscribe(() => {

        //Quitamos la caja ofrecida al creador de la oferta
        this.api.removeCollectibleFromUser(
          trade.offeredBoxId,
          trade.ownerId
        ).subscribe(() => {

          this.endTrade();
        });

      });

    });
  }

}