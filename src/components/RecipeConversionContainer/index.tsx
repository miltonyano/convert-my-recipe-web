import React, {
  ChangeEvent,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';
import CheckboxTree from 'react-checkbox-tree';
import parse, { domToReact } from 'html-react-parser';
import { sanitize } from 'dompurify';
import { useHistory } from 'react-router-dom';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import '../../utils/string.extensions';

import Button from '../Button';

import {
  Container,
  RecipeContainer,
  ParsedRecipeContainer,
  UnitSpan,
  ButtonContainer,
  CheckboxTreeContainer,
} from './styles';

interface UnitList {
  value: number;
  unitText: string;
  term: string;
  id: string;
  to?: string;
  convertedValue?: number;
}

interface UnitGroup {
  name: string;
  type: string;
  unitList: UnitList[];
  conversion: string[];
}

interface SelectedOption {
  [key: string]: string;
}

interface IsHighlighted {
  [key: string]: boolean;
}

interface TreeMap {
  [key: string]: string[];
}

interface ApiResponse {
  recipe: string;
}

const RecipeConversionContainer: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();

  const parsedRecipeSanitized = useMemo(() => {
    const parsedRecipe =
      localStorage.getItem('@ConvertMyRecipe:parsedRecipe') || '';

    return sanitize(parsedRecipe, {
      ALLOWED_TAGS: ['span'],
      ALLOWED_ATTR: ['class', 'id'],
    });
  }, []);

  const unitGroup = useMemo<UnitGroup[]>(() => {
    const storedUnitGroup = localStorage.getItem('@ConvertMyRecipe:unitGroup');
    return storedUnitGroup ? JSON.parse(storedUnitGroup) : [];
  }, []);

  const treeMap = useMemo(() => {
    return unitGroup.reduce<TreeMap>((acc, group) => {
      acc[group.name] = group.unitList.map(unit => unit.id);
      return acc;
    }, {});
  }, [unitGroup]);

  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [disabledButton, setDisabledButton] = useState(true);

  const [selectedOption, setSelectedOption] = useState(() => {
    return unitGroup.reduce<SelectedOption>((acc, group) => {
      acc[group.name] = '';
      group.unitList.forEach(unit => {
        acc[unit.id] = '';
      });

      return acc;
    }, {});
  });

  const [isHighlighted, setIsHighlighted] = useState(() => {
    return unitGroup.reduce<IsHighlighted>((acc, group) => {
      group.unitList.forEach(unit => {
        acc[unit.id] = false;
      });

      return acc;
    }, {});
  });

  useEffect(() => {
    const anySelected = Object.values(selectedOption).some(
      option => option !== '',
    );
    setDisabledButton(!anySelected);
  }, [selectedOption]);

  const handleEdit = useCallback(() => {
    history.push('/');
  }, [history]);

  const handleSubmit = useCallback(async () => {
    try {
      let optionSelected = false;
      const unitGroupToConvert = unitGroup.map(group => {
        const unitListToConvert = group.unitList.map(unit => {
          if (selectedOption[unit.id] === '') {
            return unit;
          }

          optionSelected = true;

          return { ...unit, to: selectedOption[unit.id] };
        });

        return { ...group, unitList: unitListToConvert };
      });

      if (!optionSelected) {
        addToast({
          type: 'info',
          title: 'No option selected',
          description:
            'Please select one of the options to start the conversion!',
        });

        return;
      }

      const response = await api.post<ApiResponse>('/recipe/convert', {
        unitGroup: unitGroupToConvert,
        parsedRecipe: parsedRecipeSanitized,
      });

      localStorage.setItem('@ConvertMyRecipe:recipe', response.data.recipe);
      localStorage.removeItem('@ConvertMyRecipe:parsedRecipe');
      localStorage.removeItem('@ConvertMyRecipe:unitGroup');

      history.push('/recipe/converted');
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Internal error',
        description: 'An error has occurred. Please try again later',
      });
    }
  }, [unitGroup, selectedOption, parsedRecipeSanitized, addToast, history]);

  const handleCheck = useCallback(
    (checkList: string[]) => {
      setChecked(checkList);

      const newIsHighlighted: IsHighlighted = { ...isHighlighted };
      Object.keys(newIsHighlighted).forEach(id => {
        newIsHighlighted[id] = checkList.includes(id);
      });
      setIsHighlighted(newIsHighlighted);
    },
    [isHighlighted],
  );

  const handleExpand = useCallback(expandList => {
    setExpanded(expandList);
  }, []);

  const handleChangeTree = useCallback(
    (event: ChangeEvent<{ name?: string; value?: unknown }>) => {
      const index = event.target.name as string;
      const newSelectedOption: SelectedOption = { ...selectedOption };
      newSelectedOption[index] = event.target.value as string;

      if (treeMap[index]) {
        treeMap[index].forEach(id => {
          newSelectedOption[id] = event.target.value as string;
        });
      }

      setSelectedOption(newSelectedOption);
    },
    [treeMap, selectedOption],
  );

  const nodes = useMemo(() => {
    return unitGroup.map(group => {
      const options = [<MenuItem value="" />];
      group.conversion.forEach(option =>
        options.push(
          <MenuItem value={option}>{option.toUpperCaseFirst()}</MenuItem>,
        ),
      );

      return {
        value: group.name,
        label: (
          <FormControl style={{ minWidth: 120, marginBottom: 8 }}>
            <FormHelperText>{`${group.name.toUpperCaseFirst()} to`}</FormHelperText>
            <Select
              id={`${group.name}-select`}
              value={selectedOption[group.name]}
              onChange={handleChangeTree}
              name={group.name}
            >
              {options}
            </Select>
          </FormControl>
        ),
        children: group.unitList.map(unit => {
          return {
            value: unit.id,
            label: (
              <FormControl style={{ minWidth: 120 }}>
                <FormHelperText>{`${unit.term} to`}</FormHelperText>
                <Select
                  id={`${unit.id}-select`}
                  value={selectedOption[unit.id]}
                  onChange={handleChangeTree}
                  name={unit.id}
                >
                  {options}
                </Select>
              </FormControl>
            ),
          };
        }),
      };
    });
  }, [handleChangeTree, unitGroup, selectedOption]);

  return (
    <Container>
      <RecipeContainer className="col-sm-9 col-md-8 col-lg-6">
        <ParsedRecipeContainer>
          <div>
            {parse(parsedRecipeSanitized, {
              replace: ({ attribs, children }) => {
                if (!attribs || !children) {
                  return null;
                }

                return (
                  <UnitSpan
                    isSelected={isHighlighted[attribs.id]}
                    className={attribs.class}
                    id={attribs.id}
                  >
                    {domToReact(children)}
                  </UnitSpan>
                );
              },
            })}
          </div>
        </ParsedRecipeContainer>

        <ButtonContainer>
          <Button className="col-sm-2" onClick={handleEdit}>
            Edit
          </Button>
          <Button
            className="col-sm-9"
            type="submit"
            onClick={handleSubmit}
            disabled={disabledButton}
          >
            Convert
          </Button>
        </ButtonContainer>
      </RecipeContainer>

      <CheckboxTreeContainer className="mt-md-0">
        <CheckboxTree
          checked={checked}
          expanded={expanded}
          onCheck={handleCheck}
          onExpand={handleExpand}
          showNodeIcon={false}
          nodes={nodes}
          iconsClass="fa5"
          icons={{
            expandClose: <FiPlus />,
            expandOpen: <FiMinus />,
          }}
        />
      </CheckboxTreeContainer>
    </Container>
  );
};

export default RecipeConversionContainer;
