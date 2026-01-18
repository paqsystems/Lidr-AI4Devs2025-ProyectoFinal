<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo: ClienteTipoTarea
 * 
 * Tabla de asociación (pivot) entre Cliente y TipoTarea.
 * Permite asignar tipos de tarea específicos (no genéricos) a clientes.
 * 
 * NOTA: La regla de negocio de visibilidad se implementará en una fase posterior:
 * - TODO: Al crear tarea, mostrar tipos genéricos + tipos asociados al cliente
 */
class ClienteTipoTarea extends Model
{
    /**
     * Nombre de la tabla
     */
    protected $table = 'PQ_PARTES_cliente_tipo_tarea';

    /**
     * Indica si el modelo debe usar timestamps
     */
    public $timestamps = true;

    /**
     * Campos que pueden ser asignados masivamente
     */
    protected $fillable = [
        'cliente_id',
        'tipo_tarea_id',
    ];

    /**
     * Relación: Un ClienteTipoTarea pertenece a un Cliente
     */
    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'cliente_id');
    }

    /**
     * Relación: Un ClienteTipoTarea pertenece a un TipoTarea
     */
    public function tipoTarea(): BelongsTo
    {
        return $this->belongsTo(TipoTarea::class, 'tipo_tarea_id');
    }
}

