//***********************************************************************************************
//   Type definitions for Leadtools.Annotations.BatesStamp.js
//   Updated: 3/11/2019 10:43
//   Version: 20.0.0.1
//
//   Dependencies:
//      Leadtools.d.ts
//      Leadtools.Annotations.Engine.d.ts
//
//   Copyright (c) 1991-2019 All Rights Reserved. LEAD Technologies, Inc.
//   https://www.leadtools.com
//***********************************************************************************************

declare module lt.Annotations.BatesStamp {

   class AnnBatesDateTime {
      add_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      remove_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      get_currentDateTime(): Date;
      set_currentDateTime(value: Date): void;
      get_format(): string;
      set_format(value: string): void;
      get_kind(): AnnDateTimeKind;
      set_kind(value: AnnDateTimeKind): void;
      asString(): string;
      get_friendlyName(): string;
      set_friendlyName(value: string): void;
      toString(): string;
      onPropertyChanged(e: lt.Annotations.Engine.AnnPropertyChangedEventArgs): void;
      clone(): IAnnBatesElement;
      constructor();
      currentDateTime: Date;
      format: string;
      kind: AnnDateTimeKind;
      friendlyName: string;
      propertyChanged: lt.Annotations.Engine.AnnPropertyChangedEventType; // read-only
   }

   class AnnBatesNumber {
      add_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      remove_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      get_numberOfDigits(): number;
      set_numberOfDigits(value: number): void;
      get_startNumber(): number;
      set_startNumber(value: number): void;
      get_autoIncrement(): boolean;
      set_autoIncrement(value: boolean): void;
      get_prefixText(): string;
      set_prefixText(value: string): void;
      get_suffixText(): string;
      set_suffixText(value: string): void;
      get_useAllDigits(): boolean;
      set_useAllDigits(value: boolean): void;
      asString(): string;
      get_friendlyName(): string;
      set_friendlyName(value: string): void;
      toString(): string;
      onPropertyChanged(e: lt.Annotations.Engine.AnnPropertyChangedEventArgs): void;
      clone(): IAnnBatesElement;
      constructor();
      numberOfDigits: number;
      startNumber: number;
      autoIncrement: boolean;
      prefixText: string;
      suffixText: string;
      useAllDigits: boolean;
      friendlyName: string;
      propertyChanged: lt.Annotations.Engine.AnnPropertyChangedEventType; // read-only
   }

   class AnnBatesStamp {
      add_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      remove_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      get_logo(): AnnBatesStampLogo;
      get_friendlyName(): string;
      set_friendlyName(value: string): void;
      get_font(): lt.Annotations.Engine.AnnFont;
      set_font(value: lt.Annotations.Engine.AnnFont): void;
      get_foreground(): lt.Annotations.Engine.AnnBrush;
      set_foreground(value: lt.Annotations.Engine.AnnBrush): void;
      get_horizontalAlignment(): lt.Annotations.Engine.AnnHorizontalAlignment;
      set_horizontalAlignment(value: lt.Annotations.Engine.AnnHorizontalAlignment): void;
      get_verticalAlignment(): lt.Annotations.Engine.AnnVerticalAlignment;
      set_verticalAlignment(value: lt.Annotations.Engine.AnnVerticalAlignment): void;
      get_elements(): AnnBatesElementCollection;
      asString(container: lt.Annotations.Engine.AnnContainer): string;
      toString(): string;
      clone(): AnnBatesStamp;
      dispose(): void;
      onPropertyChanged(e: lt.Annotations.Engine.AnnPropertyChangedEventArgs): void;
      constructor();
      logo: AnnBatesStampLogo; // read-only
      friendlyName: string;
      font: lt.Annotations.Engine.AnnFont;
      foreground: lt.Annotations.Engine.AnnBrush;
      horizontalAlignment: lt.Annotations.Engine.AnnHorizontalAlignment;
      verticalAlignment: lt.Annotations.Engine.AnnVerticalAlignment;
      elements: AnnBatesElementCollection; // read-only
      propertyChanged: lt.Annotations.Engine.AnnPropertyChangedEventType; // read-only
   }

   class AnnBatesStampComposer {
      static get_renderingEngine(): lt.Annotations.Engine.AnnRenderingEngine;
      static set_renderingEngine(value: lt.Annotations.Engine.AnnRenderingEngine): void;
      get_stamps(): AnnBatesStampCollection;
      get_targetContainers(): lt.Annotations.Engine.AnnContainerCollection;
      dispose(): void;
      save(composer: AnnBatesStampComposer): string;
      static loadFromXmlDocument(document: Document): AnnBatesStampComposer;
      static load(xmlData: string): AnnBatesStampComposer;
      constructor();
      static renderingEngine: lt.Annotations.Engine.AnnRenderingEngine;
      stamps: AnnBatesStampCollection; // read-only
      targetContainers: lt.Annotations.Engine.AnnContainerCollection; // read-only
   }

   class AnnBatesStampLogo {
      add_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      remove_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      get_picture(): lt.Annotations.Engine.AnnPicture;
      set_picture(value: lt.Annotations.Engine.AnnPicture): void;
      get_logoRect(): lt.LeadRectD;
      set_logoRect(value: lt.LeadRectD): void;
      get_stretchLogo(): boolean;
      set_stretchLogo(value: boolean): void;
      get_angle(): number;
      set_angle(value: number): void;
      get_opacity(): number;
      set_opacity(value: number): void;
      get_text(): string;
      set_text(value: string): void;
      get_font(): lt.Annotations.Engine.AnnFont;
      set_font(value: lt.Annotations.Engine.AnnFont): void;
      onPropertyChanged(e: lt.Annotations.Engine.AnnPropertyChangedEventArgs): void;
      clone(): AnnBatesStampLogo;
      constructor();
      picture: lt.Annotations.Engine.AnnPicture;
      logoRect: lt.LeadRectD;
      stretchLogo: boolean;
      angle: number;
      opacity: number;
      text: string;
      font: lt.Annotations.Engine.AnnFont;
      propertyChanged: lt.Annotations.Engine.AnnPropertyChangedEventType; // read-only
   }

   class AnnBatesStampTranslator {
      get_expressionStartSymbol(): string;
      set_expressionStartSymbol(value: string): void;
      get_expressionEndSymbol(): string;
      set_expressionEndSymbol(value: string): void;
      get_expressionSeparatingSymbol(): string;
      set_expressionSeparatingSymbol(value: string): void;
      readFromString(elementsExpression: string): IAnnBatesElement[];
      writeElementToString(element: IAnnBatesElement): string;
      writeElementsToString(elements: IAnnBatesElement[]): string;
      constructor();
      expressionStartSymbol: string;
      expressionEndSymbol: string;
      expressionSeparatingSymbol: string;
   }

   class AnnBatesText {
      add_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      remove_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      get_text(): string;
      set_text(value: string): void;
      static create(text: string): AnnBatesText;
      asString(): string;
      get_friendlyName(): string;
      set_friendlyName(value: string): void;
      toString(): string;
      onPropertyChanged(e: lt.Annotations.Engine.AnnPropertyChangedEventArgs): void;
      clone(): IAnnBatesElement;
      text: string;
      friendlyName: string;
      propertyChanged: lt.Annotations.Engine.AnnPropertyChangedEventType; // read-only
   }

   enum AnnDateTimeKind {
      utc = 0,
      local = 1
   }

   class AnnBatesElementCollection extends lt.LeadCollection {
      remove(item: IAnnBatesElement): void;
      add(item: IAnnBatesElement): void;
      addRange(items: IAnnBatesElement[]): void;
      contains(item: IAnnBatesElement): boolean;
      get_item(i: number): IAnnBatesElement;
      set_item(i: number, value: IAnnBatesElement): void;
      toArray(): IAnnBatesElement[];
      insertItem(index: number, item: IAnnBatesElement): void;  // protected
      insert(index: number, item: IAnnBatesElement): void;
      insertRange(index: number, items: IAnnBatesElement[]): void;
      insertItemRange(index: number, items: IAnnBatesElement[]): void;  // protected
      setItem(index: number, item: IAnnBatesElement): void;  // protected
      indexOf(item: IAnnBatesElement): number;
      add_collectionChanged(value: lt.Annotations.Engine.AnnNotifyCollectionChangedEventHandler): void;
      remove_collectionChanged(value: lt.Annotations.Engine.AnnNotifyCollectionChangedEventHandler): void;
      onCollectionChanged(e: lt.NotifyLeadCollectionChangedEventArgs): void;  // protected
      constructor();
      item(index: number, value?: IAnnBatesElement): IAnnBatesElement;
      collectionChanged: lt.Annotations.Engine.AnnNotifyCollectionChangedEventType; // read-only
   }

   class AnnBatesStampCollection extends lt.LeadCollection {
      remove(item: AnnBatesStamp): void;
      add(item: AnnBatesStamp): void;
      addRange(items: AnnBatesStamp[]): void;
      contains(item: AnnBatesStamp): boolean;
      get_item(i: number): AnnBatesStamp;
      set_item(i: number, value: AnnBatesStamp): void;
      toArray(): AnnBatesStamp[];
      insertItem(index: number, item: AnnBatesStamp): void;  // protected
      insert(index: number, item: AnnBatesStamp): void;
      insertRange(index: number, items: AnnBatesStamp[]): void;
      insertItemRange(index: number, items: AnnBatesStamp[]): void;  // protected
      setItem(index: number, item: AnnBatesStamp): void;  // protected
      indexOf(item: AnnBatesStamp): number;
      add_collectionChanged(value: lt.Annotations.Engine.AnnNotifyCollectionChangedEventHandler): void;
      remove_collectionChanged(value: lt.Annotations.Engine.AnnNotifyCollectionChangedEventHandler): void;
      onCollectionChanged(e: lt.NotifyLeadCollectionChangedEventArgs): void;  // protected
      constructor();
      item(index: number, value?: AnnBatesStamp): AnnBatesStamp;
      collectionChanged: lt.Annotations.Engine.AnnNotifyCollectionChangedEventType; // read-only
   }

   interface IAnnBatesElement {
      get_friendlyName(): string;
      set_friendlyName(value: string): void;
      asString(): string;
      clone(): IAnnBatesElement;
      add_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      remove_propertyChanged(value: lt.Annotations.Engine.AnnPropertyChangedEventHandler): void;
      friendlyName: string;
      propertyChanged: lt.Annotations.Engine.AnnPropertyChangedEventType; // read-only
   }
}
