export type CableType = '2"' | '4"' | '12"' | '';

export interface FloorData {
  id: string;
  floor: string; // ΟΡΟΦΟΣ
  apartments: number; // ΔΙΑΜΕΡΙΣΜΑΤΑ
  shops: number; // ΚΑΤΑΣΤΗΜΑΤΑ
  fb01Count: number; // FB01
  fb01Type: string; // FB01 TYPE
  fb02Count: number; // FB02
  fb02Type: string; // FB02 TYPE
  customerFb: string; // FB ΠΕΛΑΤΗ
  customerApt: string; // ΔΙΑΜΕΡΙΣΜΑ ΠΕΛΑΤΗ
  gisId: string; // GIS ID
  fb04Type: string; // FB04 TYPE
  customerFb2: string; // FB ΠΕΛΑΤΗ (2nd)
  customerRoomNumbering: string; // ΑΡΙΘΜΗΣΗ ΧΩΡΟΥ ΠΕΛΑΤΗ
  gisId2: string; // GIS ID (2nd)
  meters: number; // ΜΕΤΡΑ
  cableType: CableType; // ΕΙΔΟΣ
}