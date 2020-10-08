import React, { useState, useRef, useCallback } from 'react';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../hooks/toast';

import Header from '../../components/Header';
import Textarea from '../../components/Textarea';
import Button from '../../components/Button';

import {
  Container,
  Content,
  MainContentContainer,
  RecipeContainer,
  ButtonContainer,
  UnitContentContainer,
  UnitHeader,
  UnitTitle,
  UnitCite,
  UnitContent,
  UnitFooter,
  ConversionTableContainer,
} from './styles';

interface RecipeFormData {
  recipe: string;
}

interface UnitInText {
  value: number;
  unitText: string;
  term: string;
  id: string;
}

interface UnitFound {
  name: string;
  unitList: UnitInText[];
  conversion: string[];
}

interface ApiResponse {
  terms: string[];
  unitGroup: UnitFound[];
  parsedRecipe: string;
}

const Main: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const storedRecipe = localStorage.getItem('@ConvertMyRecipe:recipe') || '';

  const { addToast } = useToast();
  const history = useHistory();

  const [disabled, setDisabled] = useState(!storedRecipe);

  const handleTextareaChange = useCallback(() => {
    setDisabled(!formRef.current?.getFieldValue('recipe'));
  }, []);

  const handlePaste = useCallback(async () => {
    const text = await navigator.clipboard.readText();
    formRef.current?.setFieldValue('recipe', text);
    setDisabled(!formRef.current?.getFieldValue('recipe'));
  }, []);

  const handleSubmit = useCallback(
    async (data: RecipeFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          recipe: Yup.string().required('Please insert your recipe.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const { recipe } = data;

        const storedUnitGroup = localStorage.getItem(
          '@ConvertMyRecipe:unitGroup',
        );

        if (recipe !== storedRecipe || !storedUnitGroup) {
          localStorage.setItem('@ConvertMyRecipe:recipe', recipe);
          localStorage.removeItem('@ConvertMyRecipe:parsedRecipe');
          localStorage.removeItem('@ConvertMyRecipe:unitGroup');

          const response = await api.post<ApiResponse>('/recipe/parse', {
            recipe,
          });

          const { unitGroup, parsedRecipe } = response.data;

          if (!unitGroup.length) {
            addToast({
              type: 'info',
              title: 'No units found',
              description: 'No units where found in your recipe!',
            });

            return;
          }

          localStorage.setItem('@ConvertMyRecipe:parsedRecipe', parsedRecipe);
          localStorage.setItem(
            '@ConvertMyRecipe:unitGroup',
            JSON.stringify(unitGroup),
          );
        }

        history.push('/recipe');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Internal error',
          description: 'An error has occurred. Please try again later',
        });
      }
    },
    [addToast, history, storedRecipe],
  );

  return (
    <Container id="top">
      <Header />

      <Content>
        <MainContentContainer>
          <RecipeContainer>
            <Form
              ref={formRef}
              initialData={{
                recipe: storedRecipe,
              }}
              onSubmit={handleSubmit}
            >
              <Textarea
                name="recipe"
                draggable="false"
                onChange={handleTextareaChange}
                placeholder="Type or paste your recipe here. Then click on start!"
              />

              <ButtonContainer>
                <Button
                  style={{ width: '20%', marginRight: '16px' }}
                  onClick={handlePaste}
                >
                  Paste
                </Button>
                <Button type="submit" disabled={disabled}>
                  Next
                </Button>
              </ButtonContainer>
            </Form>
          </RecipeContainer>
        </MainContentContainer>

        <UnitContentContainer id="kilogram">
          <UnitHeader>
            <UnitTitle>Kilogram</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Kilogram"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Kilogram&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              The kilogram is the base unit of mass in the International System
              of Units (SI), the current metric system, having the unit symbol
              kg. The kilogram is the only base SI unit with an SI prefix (kilo)
              as part of its name and it is equal to 10&sup3; g.
            </p>
            <p>
              The kilogram was originally defined in 1795 as the mass of one
              litre of water. In 1799, the platinum Kilogramme des Archives
              replaced it as the standard of mass. In 1889, a cylinder of
              platinum-iridium, the International Prototype of the Kilogram
              (IPK) became the standard of the unit of mass for the metric
              system. The kilogram was the last of the SI units to be defined by
              a physical artefact.
            </p>
            <p>
              The word kilogram is derived from the French kilogramme, which
              itself was a learned coinage, prefixing the Greek stem of khilioi
              &quot;a thousand&quot; to gramma, a Late Latin term for &quot;a
              small weight&quot;. The word kilogramme was written into French
              law in 1795. The term gramme replaced gravet, and kilogramme
              replaced grave. The unit is often simply called a kilo in everyday
              speech.
            </p>
            <p>
              The French spelling was adopted in Great Britain when the word was
              used for the first time in English in 1795, with the spelling
              kilogram being adopted in the United States.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="gram">
          <UnitHeader>
            <UnitTitle>Gram</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Gram"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Gram&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>The gram (SI unit symbol: g) is a metric system unit of mass.</p>
            <p>
              Originally defined as &quot;the absolute weight of a volume of
              pure water equal to the cube of the hundredth part of a metre (1
              cm&sup3;), and at the temperature of melting ice&quot; (later at 4
              °C, the temperature of maximum density of water). However, in a
              reversal of reference and defined units, a gram is now defined as
              one thousandth of the SI base unit, the kilogram, or
              10&#x207b;&sup3; kg
            </p>
            <p>
              The word gramme was adopted by the French National Convention in
              its 1795 decree revising the metric system as replacing the gravet
              introduced in 1793.
            </p>
            <p>
              The gram is today the most widely used unit of measurement for
              non-liquid ingredients in cooking and grocery shopping worldwide.
              Most standards and legal requirements for nutrition labels on food
              products require relative contents to be stated per 100 g of the
              product, such that the resulting figure can also be read as a
              percentage by weight.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="milligram">
          <UnitHeader>
            <UnitTitle>Milligram</UnitTitle>
          </UnitHeader>

          <UnitContent>
            <p>
              The milligram (SI unit symbol: mg) is a metric system unit of
              mass.
            </p>
            <p>It is equal to 10&#x207b;&sup3; g.</p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="poundmass">
          <UnitHeader>
            <UnitTitle>Pound mass</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Pound_(mass)"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Pound (mass)&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>The unit pound can represent either currency, mass or force.</p>
            <p>
              The pound, pound-mass or poundmass is a unit of mass used in the
              imperial, United States customary and other systems of
              measurement. Various definitions have been used; the most common
              today is the international avoirdupois pound, which is legally
              defined as exactly 0.45359237 kilograms, and which is divided into
              16 avoirdupois ounces. The international standard symbol for the
              avoirdupois pound is lb; an alternative symbol is lbm.
            </p>
            <p>
              The unit is descended from the Roman libra (hence the abbreviation
              &quot;lb&quot;). The English word pound derives from a borrowing
              into Proto-Germanic of the Latin expression lībra pondō (&quot;the
              weight measured in libra&quot;), in which the word pondō is the
              ablative case of the Latin noun pondus (&quot;weight&quot;).
            </p>
            <p>
              In the United Kingdom, the use of the international pound was
              implemented in the Weights and Measures Act 1963.
            </p>
            <p>
              In the UK, the process of metrication and European units of
              measurement directives were expected to eliminate the use of the
              pound and ounce, but in 2007 the European Commission abandoned the
              requirement for metric-only labelling on packaged goods there, and
              allowed for dual metric–imperial marking to continue indefinitely.
            </p>
            <p>
              The US has not adopted the metric system despite many efforts to
              do so, and the pound remains widely used as one of the key United
              States customary units.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="ounce">
          <UnitHeader>
            <UnitTitle>Ounce</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Pound_(mass)"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Pound (mass)&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>The unit ounce can represent either volume, mass or force.</p>
            <p>
              The ounce is used in most British derived customary systems of
              measurement.The international standard symbol for the avoirdupois
              ounce is oz and it is equal to 1⁄16 of a common avoirdupois pound.
            </p>
            <p>
              It is primarily used in the United States to measure packaged
              foods and food portions, postal items, areal density of fabric and
              paper, boxing gloves, and so on.
            </p>
            <p>
              Ounce derives from Latin uncia, a unit that was one-twelfth
              (​1⁄12) of the Roman pound (libra). The abbreviation oz came later
              from the cognate Italian word onza (now spelled oncia).
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <ConversionTableContainer
          id="mass-conversion-table"
          className="table-responsive"
        >
          <h3>Mass Conversion Table</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">
                  to
                  <FiArrowRight />
                </th>
                <th scope="col">Milligram (mg)</th>
                <th scope="col">Gram (g)</th>
                <th scope="col">Kilogram (kg)</th>
                <th scope="col">Poundmass (lb)</th>
                <th scope="col">Ounce (oz)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Milligram</th>
                <td>-</td>
                <td>0.001</td>
                <td>1e-6</td>
                <td>2.2046226218488E-6</td>
                <td>3.5273962e-5</td>
              </tr>
              <tr>
                <th scope="row">Gram</th>
                <td>1,000</td>
                <td>-</td>
                <td>0.001</td>
                <td>0.00220462</td>
                <td>0.035274</td>
              </tr>
              <tr>
                <th scope="row">Kilogram</th>
                <td>1,000,000</td>
                <td>1,000</td>
                <td>-</td>
                <td>2.20462</td>
                <td>35.274</td>
              </tr>
              <tr>
                <th scope="row">Poundmass</th>
                <td>453592</td>
                <td>453.592</td>
                <td>0.453592</td>
                <td>-</td>
                <td>16</td>
              </tr>
              <tr>
                <th scope="row">Ounce</th>
                <td>28349.5</td>
                <td>28.3495</td>
                <td>0.0283495</td>
                <td>0.0625</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </ConversionTableContainer>

        <UnitContentContainer id="liter">
          <UnitHeader>
            <UnitTitle>Liter</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Litre"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Litre&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              The litre or liter (SI symbols L and l) is a metric unit of
              volume. It is equal to 1 cubic decimetre (dm&sup3;), 1000 cubic
              centimetres (cm&sup3;) or 0.001 cubic metre (m&sup3;). A cubic
              decimetre (or litre) occupies a volume of 10 cm × 10 cm × 10 cm
              and is thus equal to one-thousandth of a cubic metre.
            </p>
            <p>
              The original French metric system used the litre as a base unit.
              The word litre is derived from an older French unit, the litron,
              whose name came from Greek via Latin, and which equalled
              approximately 0.831 litres. The litre was also used in several
              subsequent versions of the metric system and is accepted for use
              with the SI, although not an SI unit—the SI unit of volume is the
              cubic metre (m&sup3;). The spelling used by the International
              Bureau of Weights and Measures is &quot;litre&quot;, a spelling
              which is shared by almost all English-speaking countries. The
              spelling &quot;liter&quot; is predominantly used in American
              English.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="milliliter">
          <UnitHeader>
            <UnitTitle>Milliliter</UnitTitle>
          </UnitHeader>

          <UnitContent>
            <p>
              The milliliter (SI unit symbol: ml) is a metric system unit of
              volume.
            </p>
            <p>It is equal to 10&#x207b;&sup3; l.</p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="fluidounce">
          <UnitHeader>
            <UnitTitle>Fluid ounce</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Fluid_ounce"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Fluid ounce&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              A fluid ounce (abbreviated fl oz, fl. oz. or oz. fl.) is a unit of
              volume typically used for measuring liquids. Various definitions
              have been used throughout history, but only two are still in
              common use: the British Imperial and the United States customary
              fluid ounce.
            </p>
            <p>
              An imperial fluid ounce is ​1⁄20 of an imperial pint, ​1⁄160 of an
              imperial gallon or approximately 28.41 ml. While a US fluid ounce
              is ​1⁄16 of a US fluid pint, ​1⁄128 of a US liquid gallon or
              approximately 29.57 ml, making it about 4.08% larger than the
              imperial fluid ounce.
            </p>
            <p>
              The fluid ounce was originally the volume occupied by one ounce of
              some substance, for example wine (in England) or water (in
              Scotland). The ounce in question also varied depending on the
              system of fluid measure, such as that used for wine versus ale.
            </p>
            <p>
              In 1824, the British Parliament defined the imperial gallon as the
              volume of ten pounds of water at standard temperature. The gallon
              was divided into four quarts, the quart into two pints, the pint
              into four gills, and the gill into five ounces; thus, there were
              160 imperial fluid ounces to the gallon.
            </p>
            <p>
              The US fluid ounce is based on the US gallon, which in turn is
              based on the wine gallon of 231 cubic inches that was used in the
              United Kingdom prior to 1824. With the adoption of the
              international inch, the US fluid ounce became 29.5735295625 ml
              exactly.
            </p>
            <p>
              For serving sizes on nutrition labels in the US, regulation
              requires the use of &quot;common household measures&quot;, which
              defines a fluid ounce as exactly 30 milliliters.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="teaspoon">
          <UnitHeader>
            <UnitTitle>Teaspoon</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Teaspoon"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Teaspoon&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              A teaspoon (tsp.) is a small spoon that can be used to stir a cup
              of tea or coffee, or as a tool for measuring volume. The size of
              teaspoons ranges from about 2.5 to 7.3 mL (0.088 to 0.257 imp fl
              oz; 0.085 to 0.247 US fl oz). For cooking purposes and, more
              importantly, for dosing of medicine, a teaspoon or teaspoonful is
              defined as 5 mL (0.18 imp fl oz; 0.17 US fl oz).
            </p>
            <p>
              In English it is abbreviated as tsp. or, less often, as t., ts.,
              or tspn.. The abbreviation is never capitalized because a capital
              letter is customarily reserved for the larger tablespoon
              (&quot;Tbsp.&quot;, &quot;T.&quot;, &quot;Tbls.&quot;, or
              &quot;Tb.&quot;).
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="tablespoon">
          <UnitHeader>
            <UnitTitle>Tablespoon</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Tablespoon"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Tablespoon&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              In many English-speaking regions, the term refers to a large spoon
              used for serving; however, in some regions, including parts of
              Canada, it is the largest type of spoon used for eating.
            </p>
            <p>
              It is also used as a cooking measure of volume. In this capacity,
              it is most commonly abbreviated tbsp. or T., and occasionally
              referred to as a tablespoonful to distinguish it from the utensil.
              The unit of measurement varies by region: a United States
              tablespoon is approximately 14.8 mL (0.50 US fl oz), a United
              Kingdom and Canadian tablespoon is exactly 15 mL (0.51 US fl oz),
              and an Australian tablespoon is 20 mL (0.68 US fl oz).
            </p>
            <p>
              In most places except Australia, one tablespoon equals three
              teaspoons.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="cup">
          <UnitHeader>
            <UnitTitle>Cup</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Foot_(unit)"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Foot_(unit)&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              The cup (cp) is a cooking measure of volume, commonly associated
              with cooking and serving sizes. It is traditionally equal to half
              a liquid pint in US customary units, or an amount between 200 ml
              and 250 ml (​1⁄5 and ​1⁄4 of a litre) in the metric system, which
              may vary due to location. Because actual drinking cups may differ
              greatly from the size of this unit, standard measuring cups are
              usually used instead.
            </p>
            <p>
              The cup currently used in the United States for nutrition
              labelling is defined in United States law as 240 ml.
            </p>
            <p>
              Australia, Canada, New Zealand, and some other members of the
              Commonwealth of Nations, being former British colonies that have
              since metricated, employ a &quot;metric cup&quot; of 250
              millilitres. Although derived from the metric system, it is not an
              SI unit.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <ConversionTableContainer
          id="volume-conversion-table"
          className="table-responsive"
        >
          <h3>Volume Conversion Table</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">
                  to
                  <FiArrowRight />
                </th>
                <th scope="col">Liter (l)</th>
                <th scope="col">Milliliter (ml)</th>
                <th scope="col">Fuidonce (floz)</th>
                <th scope="col">Teaspoon (tsp)</th>
                <th scope="col">Tablespoon (tbsp)</th>
                <th scope="col">Cup (cp)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Liter</th>
                <td>-</td>
                <td>1,000</td>
                <td>33.814</td>
                <td>202.884</td>
                <td>67.628</td>
                <td>4.22675</td>
              </tr>
              <tr>
                <th scope="row">Milliliter</th>
                <td>0.001</td>
                <td>-</td>
                <td>3.3814e-5</td>
                <td>0.000202884</td>
                <td>6.7628e-5</td>
                <td>4.22675e-6</td>
              </tr>
              <tr>
                <th scope="row">Fuidonce</th>
                <td>0.0295735</td>
                <td>29.5735</td>
                <td>-</td>
                <td>6</td>
                <td>2</td>
                <td>0.125</td>
              </tr>
              <tr>
                <th scope="row">Teaspoon</th>
                <td>0.00492892</td>
                <td>4.92892</td>
                <td>0.166667</td>
                <td>-</td>
                <td>0.333333</td>
                <td>0.0208333</td>
              </tr>
              <tr>
                <th scope="row">Tablespoon</th>
                <td>0.0147868</td>
                <td>14.7868</td>
                <td>0.5</td>
                <td>3</td>
                <td>-</td>
                <td>0.0625</td>
              </tr>
              <tr>
                <th scope="row">Cup</th>
                <td>0.236588</td>
                <td>236.588</td>
                <td>8</td>
                <td>48</td>
                <td>16</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </ConversionTableContainer>

        <UnitContentContainer id="meter">
          <UnitHeader>
            <UnitTitle>Meter</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Metre"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Metre&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              The metre or meter is the base unit of length in the International
              System of Units (SI). The SI unit symbol is m. The metre is
              defined as the length of the path travelled by light in a vacuum
              in 1 / 299 792 458 of a second. The metre was originally defined
              in 1793 as one ten-millionth of the distance from the equator to
              the North Pole along a great circle. In 1799, the metre was
              redefined in terms of a prototype metre bar. In 1960, the metre
              was redefined in terms of a certain number of wavelengths of a
              certain emission line of krypton-86. The current definition was
              adopted in 1983 and slightly modified for the sake of precision in
              2019.
            </p>
            <p>
              Metre is the standard spelling of the metric unit for length in
              nearly all English-speaking nations except the United States and
              the Philippines, which use meter. Other Germanic languages, such
              as German, Dutch, and the Scandinavian languages likewise spell
              the word meter.
            </p>
            <p>
              The etymological roots of metre can be traced to the Greek verb
              metreo (to measure, count or compare) and noun metron (a measure),
              which were used for physical measurement, for poetic metre and by
              extension for moderation or avoiding extremism (as in &quot;be
              measured in your response&quot;). This range of uses is also found
              in Latin (metior, mensura), French (mètre, mesure), English and
              other languages. The motto &quot;metro chro&quot; in the seal of
              the International Bureau of Weights and Measures (BIPM), may be
              translated as &quot;Use measure!&quot;, thus calls for both
              measurement and moderation. The use of the word metre (for the
              French unit mètre) in English began at least as early as 1797.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="centimeter">
          <UnitHeader>
            <UnitTitle>Centimeter</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Centimetre"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Centimetre&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              A centimetre or centimeter (SI symbol cm) is a unit of length in
              the metric system, equal to one hundredth of a metre
              (10&#x207b;&sup2; m). The centimetre was the base unit of length
              in the now deprecated centimetre–gram–second (CGS) system of
              units.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="inch">
          <UnitHeader>
            <UnitTitle>Inch</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Inch"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Inch&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              The inch (abbreviation: in or ″) is a unit of length in the
              (British) imperial and United States customary systems of
              measurement. It is equal to ​1⁄36 yard or ​1⁄12 of a foot. Derived
              from the Roman uncia (&quot;twelfth&quot;), the word inch is also
              sometimes used to translate similar units in other measurement
              systems, usually understood as deriving from the width of the
              human thumb.
            </p>
            <p>
              Standards for the exact length of an inch have varied in the past,
              but since the adoption of the international yard during the 1950s
              and 1960s, it has been based on the metric system and defined as
              exactly 25.4 mm.
            </p>
            <p>
              The English word &quot;inch&quot; was an early borrowing from
              Latin uncia (&quot;one-twelfth; Roman inch; Roman ounce&quot;) not
              present in other Germanic languages.
            </p>
            <p>
              &quot;Inch&quot; is cognate with &quot;ounce&quot; (Old English:
              ynse), whose separate pronunciation and spelling reflect its
              reborrowing in Middle English from Anglo-Norman unce and ounce.
            </p>
            <p>
              The inch is a commonly used customary unit of length in the United
              States, Canada, and the United Kingdom. It is also used in Japan
              for electronic parts, especially display screens. In most of
              continental Europe, the inch is also used informally as a measure
              for display screens. For the United Kingdom, guidance on public
              sector use states that, since 1 October 1995, without time limit,
              the inch (along with the foot) is to be used as a primary unit for
              road signs and related measurements of distance (with the possible
              exception of clearance heights and widths) and may continue to be
              used as a secondary or supplementary indication following a metric
              measurement for other purposes.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="foot">
          <UnitHeader>
            <UnitTitle>Foot</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Foot_(unit)"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Foot_(unit)&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              The foot (pl. feet), abbreviation and IEEE standard symbol: ft, is
              a unit of length in the imperial and US customary systems of
              measurement. The prime symbol, ′, is a customarily used
              alternative symbol. Since the International Yard and Pound
              Agreement of 1959, one foot is defined as 0.3048 meters exactly.
              In customary and imperial units, one foot comprises 12 inches and
              one yard comprises three feet. Historically the &quot;foot&quot;
              was a part of many local systems of units, including the Greek,
              Roman, Chinese, French, and English systems. It varied in length
              from country to country, from city to city, and sometimes from
              trade to trade. Its length was usually between 250 mm and 335 mm
              and was generally, but not always, subdivided into 12 inches or 16
              digits.
            </p>
            <p>
              The United States is the only industrialized nation that uses the
              international foot in preference to the meter in its commercial,
              engineering, and standards activities. The foot is legally
              recognized in the United Kingdom. Its usage is widespread among
              the British public as a measurement of height. The foot is
              recognized as an alternative expression of length in Canada
              officially defined as a unit derived from the meter although both
              the U.K. and Canada have partially metricated their units of
              measurement. The measurement of altitude in international aviation
              is one of the few areas where the foot is used outside the
              English-speaking world.
            </p>
            <p>
              The length of the international foot corresponds to a human foot
              with shoe size of 13 (UK), 14 (US male), 15.5 (US female) or 48
              (EU sizing).
            </p>
            <p>
              Historically, the human body has been used to provide the basis
              for units of length. The foot of a white male is typically about
              15.3% of his height, giving a person of 160 centimeters (5 ft 3
              in) a foot of 245 millimeters (9.6 in) and one of 180 centimeters
              (5 ft 11 in) a foot of 275 millimeters (10.8 in).
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <ConversionTableContainer
          id="length-conversion-table"
          className="table-responsive"
        >
          <h3>Length Conversion Table</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">
                  to
                  <FiArrowRight />
                </th>
                <th scope="col">Meter (m)</th>
                <th scope="col">Centimeter (cm)</th>
                <th scope="col">Inch (in)</th>
                <th scope="col">Foot (ft)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Meter</th>
                <td>-</td>
                <td>100</td>
                <td>39.3701</td>
                <td>3.28084</td>
              </tr>
              <tr>
                <th scope="row">Centimeter</th>
                <td>0.01</td>
                <td>-</td>
                <td>0.393701</td>
                <td>0.0328084</td>
              </tr>
              <tr>
                <th scope="row">Inch</th>
                <td>0.0254</td>
                <td>2.54</td>
                <td>-</td>
                <td>0.0833333</td>
              </tr>
              <tr>
                <th scope="row">Foot</th>
                <td>0.3048</td>
                <td>30.48</td>
                <td>12</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </ConversionTableContainer>

        <UnitContentContainer id="celsius">
          <UnitHeader>
            <UnitTitle>Celsius</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Celsius"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Celsius&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              The degree Celsius is a unit of temperature on the Celsius scale
              (originally known as the centigrade scale). The degree Celsius
              (symbol: °C) can refer to a specific temperature on the Celsius
              scale or a unit to indicate a difference between two temperatures
              or an uncertainty.
            </p>
            <p>
              By international agreement, between 1954 and 2019 the unit degree
              Celsius and the Celsius scale were defined by absolute zero and
              the triple point of Vienna Standard Mean Ocean Water (VSMOW), a
              precisely defined water standard. This definition also precisely
              related the Celsius scale to the Kelvin scale, which defines the
              SI base unit of thermodynamic temperature with symbol K. Absolute
              zero, the lowest temperature possible, is defined as being exactly
              0 K and −273.15 °C.
            </p>
            <p>
              In 1742, Swedish astronomer Anders Celsius (1701–1744) created a
              temperature scale that was the reverse of the scale now known as
              &quot;Celsius&quot;: 0 represented the boiling point of water,
              while 100 represented the freezing point of water. In his paper
              Observations of two persistent degrees on a thermometer, he
              recounted his experiments showing that the melting point of ice is
              essentially unaffected by pressure. He also determined with
              remarkable precision how the boiling point of water varied as a
              function of atmospheric pressure. He proposed that the zero point
              of his temperature scale, being the boiling point, would be
              calibrated at the mean barometric pressure at mean sea level. This
              pressure is known as one standard atmosphere.
            </p>
            <p>
              Since the 19th century, the scientific and thermometry communities
              worldwide have used the phrase &quot;centigrade scale&quot; and
              temperatures were often reported simply as &quot;degrees&quot; or,
              when greater specificity was desired, as &quot;degrees
              centigrade&quot;, with the symbol °C. However, the term centigrade
              was also used in the Spanish and French language as a unit of
              angular measurement.
            </p>
            <p>
              To eliminate confusion between the unit of temperature and the
              unit of angular measurement, the 9th meeting of the General
              Conference on Weights and Measures and the Comité International
              des Poids et Mesures (CIPM) formally adopted &quot;degree
              Celsius&quot; in 1948 for the degree of temperature, keeping the
              recognized degree symbol (°).
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <UnitContentContainer id="fahrenheit">
          <UnitHeader>
            <UnitTitle>Fahrenheit</UnitTitle>
            <UnitCite>
              {'This article uses material from the Wikipedia article '}
              <a
                href="https://en.wikipedia.org/wiki/Fahrenheit"
                target="_blank"
                rel="noopener noreferrer"
              >
                &quot;Fahrenheit&quot;
              </a>
              {', which is released under the '}
              <a
                href="https://creativecommons.org/licenses/by-sa/3.0/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Creative Commons Attribution-Share-Alike License 3.0
              </a>
            </UnitCite>
          </UnitHeader>

          <UnitContent>
            <p>
              The Fahrenheit scale is a temperature scale based on one proposed
              in 1724 by the physicist Daniel Gabriel Fahrenheit (1686–1736). It
              uses the degree Fahrenheit (symbol: °F) as the unit. Several
              accounts of how he originally defined his scale exist, but the
              original paper suggests the lower defining point, 0 °F, was
              established as the freezing temperature of a solution of brine
              made from a mixture of water, ice, and ammonium chloride.
            </p>
            <p>
              The Fahrenheit scale is now usually defined by two fixed points:
              the temperature at which pure water freezes into ice is defined as
              32 °F and the boiling point of water is defined to be 212 °F, both
              at sea level and under standard atmospheric pressure (a 180 °F
              separation).
            </p>
            <p>
              Fahrenheit was the first standardized temperature scale to be
              widely used, but its use is now limited. It is the official
              temperature scale in the United States, the Cayman Islands, and
              Liberia. In the United Kingdom, degrees Fahrenheit are often given
              alongside degrees Celsius, as some people are still more familiar
              with Fahrenheit, or for editorial effect. All other countries in
              the world now officially use the Celsius scale.
            </p>
          </UnitContent>
          <UnitFooter>
            <a href="#top">Back to top</a>
          </UnitFooter>
        </UnitContentContainer>

        <ConversionTableContainer
          id="temperature-conversion-table"
          className="table-responsive"
        >
          <h3>Temperature Conversion Table</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th scope="col">
                  to
                  <FiArrowRight />
                </th>
                <th scope="col">Celsius (°C)</th>
                <th scope="col">Fahrenheit (°F)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Celsius</th>
                <td>-</td>
                <td>33.8</td>
              </tr>
              <tr>
                <th scope="row">Fahrenheit</th>
                <td>-17.2222</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </ConversionTableContainer>
      </Content>
    </Container>
  );
};

export default Main;
