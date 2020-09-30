import React, {
  ChangeEvent,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import CheckboxTree from 'react-checkbox-tree';
import parse, { domToReact } from 'html-react-parser';
import { sanitize } from 'dompurify';
import { useHistory } from 'react-router-dom';
import { AiFillCaretRight, AiFillCaretDown } from 'react-icons/ai';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';

import '../../utils/string.extensions';

import Button from '../Button';

import {
  Container,
  RecipeContainer,
  UnitSpan,
  ButtonContainer,
} from './styles';

interface UnitInText {
  value: number;
  unitText: string;
  term: string;
  id: string;
}

interface UnitFound {
  name: string;
  type: string;
  unitList: UnitInText[];
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

interface Convert {
  id: string;
  value: number;
  to: string;
}

interface FormData {
  name: string;
  convert: Convert[];
}

interface Converted {
  id: string;
  value: number;
  to: string;
  convertedValue: number;
}

interface ApiResponse {
  name: string;
  convert: Converted[];
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

  const unitGroup = useMemo<UnitFound[]>(() => {
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
      const data = unitGroup.reduce<FormData[]>((acc, group) => {
        const { name } = group;
        const convert = group.unitList.reduce<Convert[]>((accUnit, unit) => {
          if (selectedOption[unit.id] === '') {
            return accUnit;
          }

          accUnit.push({
            id: unit.id,
            value: unit.value,
            to: selectedOption[unit.id],
          });
          return accUnit;
        }, []);

        return convert.length ? [...acc, { name, convert }] : acc;
      }, []);

      if (!data.length) {
        addToast({
          type: 'info',
          title: 'No option selected',
          description:
            'Please select one of the options to start the conversion!',
        });

        return;
      }

      const response = await api.post<ApiResponse>('/recipe/convert', data);

      console.log(response.data);
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Internal error',
        description: 'An error has occurred. Please try again later',
      });
    }
  }, [unitGroup, selectedOption, addToast]);

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
      const labelId = `${group.name}-label`;
      const options = [<MenuItem value="">Cancel</MenuItem>];
      group.conversion.forEach(option =>
        options.push(
          <MenuItem value={option}>{option.toUpperCaseFirst()}</MenuItem>,
        ),
      );

      return {
        value: group.name,
        label: (
          <FormControl style={{ minWidth: 120 }}>
            <InputLabel id={labelId}>
              {`${group.name.toUpperCaseFirst()} to`}
            </InputLabel>
            <Select
              labelId={labelId}
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
          const childrenLabelId = `${unit.id}-label`;
          return {
            value: unit.id,
            label: (
              <FormControl style={{ minWidth: 120 }}>
                <InputLabel id={childrenLabelId}>
                  {`${unit.term} to`}
                </InputLabel>
                <Select
                  labelId={childrenLabelId}
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
      <RecipeContainer>
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

        <h1>AD</h1>
        <ButtonContainer>
          <Button
            style={{ width: '20%', marginRight: '16px' }}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={disabledButton}
          >
            Start
          </Button>
        </ButtonContainer>
      </RecipeContainer>

      <CheckboxTree
        checked={checked}
        expanded={expanded}
        onCheck={handleCheck}
        onExpand={handleExpand}
        showNodeIcon={false}
        nodes={nodes}
        iconsClass="fa5"
        icons={{
          expandClose: <AiFillCaretRight />,
          expandOpen: <AiFillCaretDown />,
        }}
      />
    </Container>
  );
};

export default RecipeConversionContainer;
