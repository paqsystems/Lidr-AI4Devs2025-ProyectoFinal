<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

/**
 * Modelo: Usuario (Empleado/Asistente/Agente)
 * 
 * Representa a los empleados/asistentes/agentes que cargan las tareas al sistema.
 * 
 * Campos importantes:
 * - code: Código único de usuario para autenticación
 * - supervisor: Indica si el usuario tiene permisos de supervisor
 * - activo: Indica si el usuario está activo
 * - inhabilitado: Indica si el usuario está inhabilitado (soft delete)
 * 
 * Permisos según tipo de usuario:
 * - Usuario normal (supervisor = false): Solo puede crear, editar y eliminar sus propias tareas
 * - Supervisor (supervisor = true): Puede ver todas las tareas y gestionar tareas de cualquier usuario
 */
class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory;

    /**
     * Nombre de la tabla
     */
    protected $table = 'PQ_PARTES_usuario';

    /**
     * Campos que pueden ser asignados masivamente
     */
    protected $fillable = [
        'code',
        'nombre',
        'email',
        'password',
        'supervisor',
        'activo',
        'inhabilitado',
    ];

    /**
     * Campos ocultos en serialización
     */
    protected $hidden = [
        'password',
        'password_hash',
        'remember_token',
    ];

    /**
     * Casts de tipos de datos
     */
    protected $casts = [
        'supervisor' => 'boolean',
        'activo' => 'boolean',
        'inhabilitado' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Valores por defecto
     */
    protected $attributes = [
        'supervisor' => false,
        'activo' => true,
        'inhabilitado' => false,
    ];

    /**
     * Relación: Un Usuario tiene muchos RegistroTarea
     */
    public function registrosTarea(): HasMany
    {
        return $this->hasMany(RegistroTarea::class, 'usuario_id');
    }

    /**
     * Verificar si el usuario está habilitado
     * 
     * @return bool
     */
    public function isHabilitado(): bool
    {
        return $this->activo && !$this->inhabilitado;
    }

    /**
     * Verificar si el usuario es supervisor
     * 
     * @return bool
     */
    public function isSupervisor(): bool
    {
        return $this->supervisor === true;
    }

    /**
     * Scope para usuarios habilitados
     */
    public function scopeHabilitados($query)
    {
        return $query->where('activo', true)
            ->where('inhabilitado', false);
    }

    /**
     * Scope para supervisores
     */
    public function scopeSupervisores($query)
    {
        return $query->where('supervisor', true);
    }
}

