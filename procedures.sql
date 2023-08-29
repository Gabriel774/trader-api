CREATE OR REPLACE FUNCTION update_stocks(client_id bigint) RETURNS void AS $$
DECLARE
    counter integer := 1;
    updated_stocks integer[] := '{}';
    stock_id integer;
    variation_value numeric;
    previous_value numeric;
    new_value numeric;
BEGIN
    WHILE counter <= 10 LOOP
        SELECT id INTO stock_id FROM "UserStocks" WHERE "userId" = client_id AND id NOT IN (SELECT unnest(updated_stocks)) ORDER BY random() LIMIT 1;

        updated_stocks := updated_stocks || stock_id;

        variation_value := ROUND(random() * 101) - 50;

        SELECT value INTO previous_value FROM "UserStocks" WHERE id = stock_id;

        new_value := previous_value + variation_value;

        IF new_value < 50 THEN
            new_value := 50;
        ELSIF new_value > 10000 THEN
            new_value := 10000;
        END IF;

        UPDATE "UserStocks" SET value = new_value WHERE id = stock_id;

        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_stock_quantity(
    client_id bigint,
    stock_id bigint,
    transaction_quantity bigint,
    type boolean
) RETURNS void AS $$
DECLARE
    user_balance bigint;
    stock_quantity bigint;
    stock_value bigint;
    transaction_value bigint;
BEGIN
    SELECT balance INTO user_balance FROM "User" WHERE id = client_id;

    SELECT quantity, value INTO stock_quantity, stock_value FROM "UserStocks" WHERE id = stock_id;

        IF type THEN
            transaction_value := stock_value * transaction_quantity;

            IF transaction_value > user_balance THEN
                RAISE EXCEPTION 'Saldo insuficiente para realizar a compra';
            END IF;

            UPDATE "User" SET balance = balance - transaction_value WHERE id = client_id;
            UPDATE "UserStocks" SET quantity = quantity + transaction_quantity WHERE id = stock_id;
        ELSE
            IF transaction_quantity > stock_quantity THEN
                RAISE EXCEPTION 'Quantidade de ações insuficiente para realizar a venda';
            END IF;

            transaction_value := stock_value * transaction_quantity;

            UPDATE "User" SET balance = balance + transaction_value WHERE id = client_id;
            UPDATE "UserStocks" SET quantity = quantity - transaction_quantity WHERE id = stock_id;
        END IF;
    
END;
$$ LANGUAGE plpgsql;
