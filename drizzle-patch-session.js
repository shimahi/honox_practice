/**
 * NOTE:
 * DrizzleのバグによってBunのテストでgetメソッドおよびfindFirstメソッドが機能しないため、  node_modules/drizzle-orm/bun-sqlite/session.jsのgetメソッドを修正している https://github.com/drizzle-team/drizzle-orm/pull/1276/files
 * バグが修正されたらこのパッチは不要になる
 * https://github.com/drizzle-team/drizzle-orm/issues/777
 */
import { entityKind } from '../entity.js'
import { NoopLogger } from '../logger.js'
import { fillPlaceholders, sql } from '../sql/sql.js'
import { SQLiteTransaction } from '../sqlite-core/index.js'
import {
  SQLitePreparedQuery as PreparedQueryBase,
  SQLiteSession,
} from '../sqlite-core/session.js'
import { mapResultRow } from '../utils.js'
class SQLiteBunSession extends SQLiteSession {
  constructor(client, dialect, schema, options = {}) {
    super(dialect)
    this.client = client
    this.schema = schema
    this.logger = options.logger ?? new NoopLogger()
  }
  static [entityKind] = 'SQLiteBunSession'
  logger
  exec(query) {
    this.client.exec(query)
  }
  prepareQuery(query, fields, executeMethod, customResultMapper) {
    const stmt = this.client.prepare(query.sql)
    return new PreparedQuery(
      stmt,
      query,
      this.logger,
      fields,
      executeMethod,
      customResultMapper,
    )
  }
  transaction(transaction, config = {}) {
    const tx = new SQLiteBunTransaction('sync', this.dialect, this, this.schema)
    let result
    const nativeTx = this.client.transaction(() => {
      result = transaction(tx)
    })
    nativeTx[config.behavior ?? 'deferred']()
    return result
  }
}
class SQLiteBunTransaction extends SQLiteTransaction {
  static [entityKind] = 'SQLiteBunTransaction'
  transaction(transaction) {
    const savepointName = `sp${this.nestedIndex}`
    const tx = new SQLiteBunTransaction(
      'sync',
      this.dialect,
      this.session,
      this.schema,
      this.nestedIndex + 1,
    )
    this.session.run(sql.raw(`savepoint ${savepointName}`))
    try {
      const result = transaction(tx)
      this.session.run(sql.raw(`release savepoint ${savepointName}`))
      return result
    } catch (err) {
      this.session.run(sql.raw(`rollback to savepoint ${savepointName}`))
      throw err
    }
  }
}
class PreparedQuery extends PreparedQueryBase {
  constructor(stmt, query, logger, fields, executeMethod, customResultMapper) {
    super('sync', executeMethod, query)
    this.stmt = stmt
    this.logger = logger
    this.fields = fields
    this.customResultMapper = customResultMapper
  }
  static [entityKind] = 'SQLiteBunPreparedQuery'
  run(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {})
    this.logger.logQuery(this.query.sql, params)
    return this.stmt.run(...params)
  }
  all(placeholderValues) {
    const {
      fields,
      query,
      logger,
      joinsNotNullableMap,
      stmt,
      customResultMapper,
    } = this
    if (!fields && !customResultMapper) {
      const params = fillPlaceholders(query.params, placeholderValues ?? {})
      logger.logQuery(query.sql, params)
      return stmt.all(...params)
    }
    const rows = this.values(placeholderValues)
    if (customResultMapper) {
      return customResultMapper(rows)
    }
    return rows.map((row) => mapResultRow(fields, row, joinsNotNullableMap))
  }
  get(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {})
    this.logger.logQuery(this.query.sql, params)
    const { fields, joinsNotNullableMap, customResultMapper, stmt } = this
    if (!fields && !customResultMapper) {
      return stmt.get(...params)
    }

    const row = stmt.values(...params)[0]
    if (!row) {
      return void 0
    }

    if (customResultMapper) {
      return customResultMapper([row])
    }
    return mapResultRow(fields, row, joinsNotNullableMap)
  }
  values(placeholderValues) {
    const params = fillPlaceholders(this.query.params, placeholderValues ?? {})
    this.logger.logQuery(this.query.sql, params)
    return this.stmt.values(...params)
  }
}
export { PreparedQuery, SQLiteBunSession, SQLiteBunTransaction }
//# sourceMappingURL=session.js.map
