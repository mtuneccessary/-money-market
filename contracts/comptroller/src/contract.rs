use cosmwasm_std::{
    to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, Decimal, Addr
};
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg, MarketInfo};
use crate::state::{MARKETS, USER_MARKETS, Market};

pub fn instantiate(
    _deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    _msg: InstantiateMsg,
) -> StdResult<Response> {
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("contract", "comptroller"))
}

pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::RegisterMarket { asset, market, collateral_factor } => {
            execute_register_market(deps, info, asset, market, collateral_factor)
        }
        ExecuteMsg::UpdateCollateralFactor { asset, factor } => {
            execute_update_collateral_factor(deps, info, asset, factor)
        }
        ExecuteMsg::EnterMarket { asset } => {
            execute_enter_market(deps, info, asset)
        }
        ExecuteMsg::ExitMarket { asset } => {
            execute_exit_market(deps, info, asset)
        }
    }
}

pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetMarket { asset } => to_json_binary(&query_market(deps, asset)?),
        QueryMsg::GetAccountLiquidity { user } => {
            to_json_binary(&query_account_liquidity(deps, user)?)
        }
    }
}

fn execute_register_market(
    deps: DepsMut,
    _info: MessageInfo,
    asset: String,
    market: Addr,
    collateral_factor: Decimal,
) -> StdResult<Response> {
    // TODO: Add admin check
    let market_info = Market { 
        market: market.clone(), 
        collateral_factor 
    };
    MARKETS.save(deps.storage, &asset, &market_info)?;
    
    Ok(Response::new()
        .add_attribute("action", "register_market")
        .add_attribute("asset", asset)
        .add_attribute("market", market.to_string())
        .add_attribute("collateral_factor", collateral_factor.to_string()))
}

fn execute_update_collateral_factor(
    deps: DepsMut,
    _info: MessageInfo,
    asset: String,
    factor: Decimal,
) -> StdResult<Response> {
    // TODO: Add admin check
    MARKETS.update(deps.storage, &asset, |market| -> StdResult<_> {
        match market {
            Some(mut m) => {
                m.collateral_factor = factor;
                Ok(m)
            }
            None => Err(cosmwasm_std::StdError::not_found("Market not found")),
        }
    })?;
    
    Ok(Response::new()
        .add_attribute("action", "update_collateral_factor")
        .add_attribute("asset", asset)
        .add_attribute("new_factor", factor.to_string()))
}

fn execute_enter_market(
    deps: DepsMut,
    info: MessageInfo,
    asset: String,
) -> StdResult<Response> {
    // Check if market exists
    MARKETS.load(deps.storage, &asset)?;
    
    // Mark user as entered into this market
    USER_MARKETS.save(deps.storage, (&info.sender, &asset), &true)?;
    
    Ok(Response::new()
        .add_attribute("action", "enter_market")
        .add_attribute("user", info.sender.to_string())
        .add_attribute("asset", asset))
}

fn execute_exit_market(
    deps: DepsMut,
    info: MessageInfo,
    asset: String,
) -> StdResult<Response> {
    // TODO: Check if user has outstanding borrows in this market
    // For now, just remove from user markets
    USER_MARKETS.remove(deps.storage, (&info.sender, &asset));
    
    Ok(Response::new()
        .add_attribute("action", "exit_market")
        .add_attribute("user", info.sender.to_string())
        .add_attribute("asset", asset))
}

fn query_market(deps: Deps, asset: String) -> StdResult<MarketInfo> {
    let market = MARKETS.load(deps.storage, &asset)?;
    Ok(MarketInfo {
        market: market.market,
        collateral_factor: market.collateral_factor,
    })
}

fn query_account_liquidity(deps: Deps, user: String) -> StdResult<AccountLiquidityResponse> {
    let user_addr = deps.api.addr_validate(&user)?;
    
    // TODO: Query all markets user has entered
    // TODO: Get collateral values and borrow values from each market
    // TODO: Calculate health factor
    
    // For MVP, return dummy values
    Ok(AccountLiquidityResponse {
        collateral_value: Uint128::new(1000),
        borrow_value: Uint128::new(500),
        health_factor: Decimal::from_ratio(2u128, 1u128), // 2.0 = healthy
    })
}

#[cosmwasm_schema::cw_serde]
pub struct AccountLiquidityResponse {
    pub collateral_value: Uint128,
    pub borrow_value: Uint128,
    pub health_factor: Decimal,
} 