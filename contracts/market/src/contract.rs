use cosmwasm_std::{
    to_json_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128, BankMsg, Coin
};
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::{STATE, BALANCES, BORROWS, MarketState};

pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> StdResult<Response> {
    let state = MarketState {
        asset: msg.asset.clone(),
        total_supply: Uint128::zero(),
        total_borrows: Uint128::zero(),
        reserves: Uint128::zero(),
    };
    STATE.save(deps.storage, &state)?;
    
    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("contract", "market")
        .add_attribute("asset", msg.asset)
        .add_attribute("underlying_denom", msg.underlying_denom))
}

pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> StdResult<Response> {
    match msg {
        ExecuteMsg::Deposit { amount } => {
            execute_deposit(deps, env, info, amount)
        }
        ExecuteMsg::Withdraw { amount } => {
            execute_withdraw(deps, env, info, amount)
        }
        ExecuteMsg::Borrow { amount } => {
            execute_borrow(deps, env, info, amount)
        }
        ExecuteMsg::Repay { amount } => {
            execute_repay(deps, env, info, amount)
        }
    }
}

pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetBalances { user } => {
            to_json_binary(&query_balances(deps, user)?)
        }
    }
}

fn execute_deposit(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    amount: Uint128,
) -> StdResult<Response> {
    // TODO: Validate that user sent the correct tokens
    // TODO: Calculate nToken exchange rate
    // TODO: Mint nTokens to user
    
    // For MVP, just track the deposit
    BALANCES.update(deps.storage, &info.sender, |bal| -> StdResult<_> {
        Ok(bal.unwrap_or_default() + amount)
    })?;
    
    // Update total supply
    STATE.update(deps.storage, |mut state| -> StdResult<_> {
        state.total_supply += amount;
        Ok(state)
    })?;
    
    Ok(Response::new()
        .add_attribute("action", "deposit")
        .add_attribute("user", info.sender.to_string())
        .add_attribute("amount", amount.to_string()))
}

fn execute_withdraw(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    amount: Uint128,
) -> StdResult<Response> {
    // Check user has sufficient balance
    let user_balance = BALANCES.load(deps.storage, &info.sender)?;
    if user_balance < amount {
        return Err(cosmwasm_std::StdError::generic_err("Insufficient balance"));
    }
    
    // TODO: Check with comptroller if withdrawal is allowed (health factor)
    // TODO: Calculate underlying amount from nTokens
    
    // Update user balance
    BALANCES.update(deps.storage, &info.sender, |bal| -> StdResult<_> {
        Ok(bal.unwrap_or_default() - amount)
    })?;
    
    // Update total supply
    STATE.update(deps.storage, |mut state| -> StdResult<_> {
        state.total_supply -= amount;
        Ok(state)
    })?;
    
    // TODO: Send underlying tokens to user
    let state = STATE.load(deps.storage)?;
    let withdraw_msg = BankMsg::Send {
        to_address: info.sender.to_string(),
        amount: vec![Coin {
            denom: "unibi".to_string(), // TODO: Use actual denom from state
            amount,
        }],
    };
    
    Ok(Response::new()
        .add_message(withdraw_msg)
        .add_attribute("action", "withdraw")
        .add_attribute("user", info.sender.to_string())
        .add_attribute("amount", amount.to_string()))
}

fn execute_borrow(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    amount: Uint128,
) -> StdResult<Response> {
    // TODO: Check with comptroller if borrow is allowed (health factor)
    // TODO: Calculate interest rate and update borrow index
    
    // For MVP, just track the borrow
    BORROWS.update(deps.storage, &info.sender, |b| -> StdResult<_> {
        Ok(b.unwrap_or_default() + amount)
    })?;
    
    // Update total borrows
    STATE.update(deps.storage, |mut state| -> StdResult<_> {
        state.total_borrows += amount;
        Ok(state)
    })?;
    
    // Send borrowed tokens to user
    let borrow_msg = BankMsg::Send {
        to_address: info.sender.to_string(),
        amount: vec![Coin {
            denom: "unusd".to_string(), // TODO: Use actual denom from state
            amount,
        }],
    };
    
    Ok(Response::new()
        .add_message(borrow_msg)
        .add_attribute("action", "borrow")
        .add_attribute("user", info.sender.to_string())
        .add_attribute("amount", amount.to_string()))
}

fn execute_repay(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    amount: Uint128,
) -> StdResult<Response> {
    // TODO: Validate that user sent the correct tokens
    // TODO: Calculate interest and update borrow index
    
    // Check user has outstanding borrows
    let user_borrows = BORROWS.load(deps.storage, &info.sender)?;
    let repay_amount = if amount > user_borrows { user_borrows } else { amount };
    
    // Update user borrows
    BORROWS.update(deps.storage, &info.sender, |b| -> StdResult<_> {
        Ok(b.unwrap_or_default() - repay_amount)
    })?;
    
    // Update total borrows
    STATE.update(deps.storage, |mut state| -> StdResult<_> {
        state.total_borrows -= repay_amount;
        Ok(state)
    })?;
    
    Ok(Response::new()
        .add_attribute("action", "repay")
        .add_attribute("user", info.sender.to_string())
        .add_attribute("amount", repay_amount.to_string()))
}

fn query_balances(deps: Deps, user: String) -> StdResult<UserBalancesResponse> {
    let user_addr = deps.api.addr_validate(&user)?;
    
    let supply_balance = BALANCES.may_load(deps.storage, &user_addr)?.unwrap_or_default();
    let borrow_balance = BORROWS.may_load(deps.storage, &user_addr)?.unwrap_or_default();
    
    Ok(UserBalancesResponse {
        supply_balance,
        borrow_balance,
    })
}

#[cosmwasm_schema::cw_serde]
pub struct UserBalancesResponse {
    pub supply_balance: Uint128,
    pub borrow_balance: Uint128,
} 