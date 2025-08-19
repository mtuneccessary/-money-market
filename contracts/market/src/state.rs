use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct MarketState {
    pub asset: String,
    pub total_supply: Uint128,
    pub total_borrows: Uint128,
    pub reserves: Uint128,
}

pub const STATE: Item<MarketState> = Item::new("state");
pub const BALANCES: Map<&Addr, Uint128> = Map::new("balances");
pub const BORROWS: Map<&Addr, Uint128> = Map::new("borrows"); 