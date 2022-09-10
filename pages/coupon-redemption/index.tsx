import { useRouter } from 'next/router';
import qs from 'qs';
import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Container, FormGroup, Layout, PageHeader, TextInput, withAuth } from '../../components';
import Errors from '../../components/Errors';
import { AuthAndApiContext, ToastsContext } from '../../contexts';
import { useForm } from '../../hooks';
import styles from './CouponRedemption.module.css';

type Form = {
  couponCode: string,
};

function CouponRedemption() {
  const intl = useIntl();
  const router = useRouter();
  const { api } = useContext(AuthAndApiContext);
  const { addToast } = useContext(ToastsContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [values, , updateValue, errors, setErrors] = useForm<Form>({
    couponCode: '',
  });

  useEffect(() => {
    const { c: qsCouponCode } = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    if (qsCouponCode !== undefined && qsCouponCode.toString() !== '') {
      updateValue('couponCode', qsCouponCode);
    }
  }, []);

  return (
    <Layout className={styles.couponRedemption}>
      <PageHeader
        background="couponRedemption"
        description={intl.formatMessage({ defaultMessage: 'Please enter your coupon code.' })}
        title={intl.formatMessage({ defaultMessage: 'Redeem Coupon' })}
      />

      <Container>
        <div className={styles.body}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              setIsDisabled(true);

              const response = await api.post(`/coupons/redeem/${values.couponCode}/`, {});

              if (response.ok) {
                addToast({
                  content: intl.formatMessage({ defaultMessage: 'Your coupon is successfully redeemed.' }),
                  kind: 'success',
                });

                await router.push('/arena');
              } else {
                const responseJson = await response.json();

                setErrors(responseJson);

                setIsDisabled(false);
              }
            }}
          >
            <fieldset disabled={isDisabled}>
              <Errors errors={errors?.nonFieldErrors} />

              <FormGroup error={errors.couponCode}>
                <TextInput
                  id="text-input-coupon-code"
                  label={intl.formatMessage({ defaultMessage: 'Coupon Code' })}
                  name="couponCode"
                  onChange={updateValue}
                  required
                  type="text"
                  value={values.couponCode}
                />
              </FormGroup>

              <Button fullWidth type="submit">
                <FormattedMessage defaultMessage="Redeem Coupon" />
              </Button>
            </fieldset>
          </form>
        </div>
      </Container>
    </Layout>
  );
}

export default withAuth('user', CouponRedemption);
