<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Nota: Usamos datetime2 para SQL Server para evitar problemas de formato de fecha.
     * @see .cursor/rules/20-sql-server-datetime-format.md
     */
    public function up(): void
    {
        // Crear tabla con SQL directo para usar datetime2
        DB::statement("
            CREATE TABLE personal_access_tokens (
                id BIGINT IDENTITY(1,1) PRIMARY KEY,
                tokenable_type NVARCHAR(255) NOT NULL,
                tokenable_id BIGINT NOT NULL,
                name NVARCHAR(255) NOT NULL,
                token NVARCHAR(64) NOT NULL,
                abilities NVARCHAR(MAX) NULL,
                last_used_at DATETIME2 NULL,
                expires_at DATETIME2 NULL,
                created_at DATETIME2 NULL,
                updated_at DATETIME2 NULL
            )
        ");
        
        // Crear índice único para token
        DB::statement("CREATE UNIQUE INDEX personal_access_tokens_token_unique ON personal_access_tokens (token)");
        
        // Crear índice para tokenable
        DB::statement("CREATE INDEX personal_access_tokens_tokenable_type_tokenable_id_index ON personal_access_tokens (tokenable_type, tokenable_id)");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};
