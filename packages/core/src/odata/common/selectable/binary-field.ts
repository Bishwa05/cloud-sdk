/* Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. */
/* eslint-disable max-classes-per-file */

import { EdmTypeShared } from '../edm-types';
import { EntityBase, ODataVersionOf, Constructable } from '../entity';
import {
  ComplexTypeField,
  ConstructorOrField,
  getEdmType,
  getEntityConstructor
} from './complex-type-field';
import { EdmTypeField, SelectableEdmTypeField } from './edm-type-field';
import { ComplexTypeNamespace } from './complex-type-namespace';

/**
 * Represents a property with a binary value.
 *
 * @typeparam EntityT - Type of the entity the field belongs to
 */
export class BinaryFieldBase<EntityT extends EntityBase> extends EdmTypeField<
  EntityT,
  string
> {}

/**
 * Represents a selectable property with a binary value.
 *
 * @typeparam EntityT - Type of the entity the field belongs to
 */
export class BinaryField<EntityT extends EntityBase>
  extends BinaryFieldBase<EntityT>
  implements SelectableEdmTypeField {
  readonly selectable: true;
}

/**
 * Represents a complex type property with a binary value.
 *
 * @typeparam EntityT - Type of the entity the field belongs to
 */
export class ComplexTypeBinaryPropertyField<
  EntityT extends EntityBase,
  ComplexTypeNamespaceT extends ComplexTypeNamespace = any
> extends BinaryFieldBase<EntityT> {
  /**
   * The constructor of the entity or the complex type this field belongs to
   */
  readonly fieldOf: ConstructorOrField<EntityT, ComplexTypeNamespaceT>;

  /**
   * Creates an instance of ComplexTypeBigNumberPropertyField.
   *
   * @param fieldName - Actual name of the field used in the OData request
   * @param fieldOf - The constructor of the entity or the complex type this field belongs to
   * @param edmType - Type of the field according to the metadata description
   */
  constructor(
    fieldName: string,
    fieldOf: ConstructorOrField<EntityT, ComplexTypeNamespaceT>,
    edmType: EdmTypeShared<ODataVersionOf<EntityT>>
  );

  /**
   * @deprecated Since v1.19.0.
   *
   * Creates an instance of ComplexTypeBigNumberPropertyField.
   *
   * @param fieldName - Actual name of the field used in the OData request
   * @param entityConstructor - Constructor type of the entity the field belongs to
   * @param parentTypeName - Name of the parent complex type
   * @param edmType - Type of the field according to the metadata description
   */
  constructor(
    fieldName: string,
    entityConstructor: Constructable<EntityT>,
    parentTypeName: string,
    edmType: EdmTypeShared<ODataVersionOf<EntityT>>
  );

  /*
   * Union of the two possible constructors.
   */
  constructor(
    fieldName: string,
    fieldOf: ConstructorOrField<EntityT, ComplexTypeNamespaceT>,
    arg3: string | EdmTypeShared<ODataVersionOf<EntityT>>,
    arg4?: EdmTypeShared<ODataVersionOf<EntityT>>
  ) {
    super(fieldName, getEntityConstructor(fieldOf), getEdmType(arg3, arg4));
    this.fieldOf = fieldOf;
  }

  /**
   * Path to the field to be used in filter and order by queries. Combines the parent complex type name with the field name.
   *
   * @returns Path to the field to be used in filter and order by queries.
   */
  fieldPath(): string {
    return this.fieldOf instanceof ComplexTypeField
      ? `${this.fieldOf.fieldPath()}/${this._fieldName}`
      : this._fieldName;
  }
}
