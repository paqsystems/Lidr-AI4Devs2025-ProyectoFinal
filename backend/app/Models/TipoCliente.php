<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Modelo: TipoCliente
 * 
 * Representa los tipos de cliente disponibles en el sistema.
 * Ejemplos: "Corporativo", "PyME", "Startup", "Gobierno", etc.
 */
class TipoCliente extends Model
{
    use HasFactory;

    /**
     * Nombre de la tabla
     */
    protected $table = 'PQ_PARTES_tipo_cliente';

    /**
     * Campos que pueden ser asignados masivamente
     */
    protected $fillable = [
        'descripcion',
        'activo',
    ];

    /**
     * Casts de tipos de datos
     */
    protected $casts = [
        'activo' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Valores por defecto
     */
    protected $attributes = [
        'activo' => true,
    ];

    /**
     * Relación: Un TipoCliente tiene muchos Cliente
     */
    public function clientes(): HasMany
    {
        return $this->hasMany(Cliente::class, 'tipo_cliente_id');
    }
}

