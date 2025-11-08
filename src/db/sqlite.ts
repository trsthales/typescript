import Database from 'better-sqlite3'

/** Abre (ou cria) banco SQLite e aplica schema idempotente.
 * Usa WAL para melhor concorrência em ambiente de desenvolvimento.
 */
export function openDb(file: string = ':memory:') {
  const db = new Database(file)
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  db.exec(`
    create table if not exists users (
      id text primary key,
      name text not null,
      email text not null unique
    );
    create table if not exists products (
      id text primary key,
      title text not null,
      description text not null,
      price real not null,
      stock integer not null,
      weightKg real not null
    );
    create table if not exists orders (
      id text primary key,
      userId text not null,
      createdAt text not null,
      itemsTotal real not null,
      discountTotal real not null,
      freightTotal real not null,
      grandTotal real not null
    );
    create table if not exists order_items (
      orderId text not null,
      productId text not null,
      quantity integer not null,
      price real not null,
      primary key (orderId, productId),
      foreign key(orderId) references orders(id) on delete cascade,
      foreign key(productId) references products(id)
    );
  `)
  return db
}
