import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from '@shared/schema';

let pool: ReturnType<typeof Pool>;
let db: ReturnType<typeof drizzle<typeof schema>>;

export { pool, db };
}
    });
    pool = database as any;
    db = drizzle(database, { schema: schema as any });
    console.log('Using SQLite database:', connectionString);
  } else {
    // PostgreSQL mode
    const { Pool } = require('@neondatabase/serverless');
    pool = new Pool({ connectionString });
    db = drizzle({ client: pool, schema });
    console.log('Using PostgreSQL database');
  }
}

export { pool, db };
