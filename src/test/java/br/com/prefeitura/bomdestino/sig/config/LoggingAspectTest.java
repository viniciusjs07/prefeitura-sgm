package br.com.prefeitura.bomdestino.sig.config;

import br.com.prefeitura.bomdestino.sig.SystemSGMApp;
import br.com.prefeitura.bomdestino.sig.aop.logging.LoggingAspect;
import io.github.jhipster.config.JHipsterConstants;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.reflect.MethodSignature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.env.Environment;
import org.springframework.transaction.annotation.Transactional;
import org.zalando.problem.ThrowableProblem;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.fail;
import static org.mockito.Mockito.*;
import static org.mockito.internal.verification.VerificationModeFactory.times;

/**
 * Test class for the LoggingAspect class.
 */
@SpringBootTest(classes = SystemSGMApp.class)
@Transactional
public class LoggingAspectTest {

    @Mock
    private Environment env;

    @Mock
    private ProceedingJoinPoint proceedingJoinPoint;

    @Mock
    private MethodSignature signature;

    @Mock
    private ThrowableProblem exception;

    private LoggingAspect loggingAspect = new LoggingAspect(env);

    @BeforeEach
    public void t() {
        this.loggingAspect = new LoggingAspect(env);
        this.loggingAspect.applicationPackagePointcut();
        this.loggingAspect.springBeanPointcut();

        when(this.proceedingJoinPoint.getSignature()).thenReturn(this.signature);
        when(this.signature.getDeclaringTypeName()).thenReturn("signatureDeclaringTypeName");
        when(this.signature.getName()).thenReturn("signatureName");
    }


    @Test
    public void testLogAfterThrowing() throws Throwable {
        this.loggingAspect.logAfterThrowing(this.proceedingJoinPoint, exception);
        verify(this.proceedingJoinPoint, never()).proceed();
        verify(this.exception, times(1)).getCause();
        verify(this.exception, never()).getMessage();
    }

    @Test
    public void testLogAfterThrowingWithDevProfile() throws Throwable {
        when(this.env.acceptsProfiles(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT)).thenReturn(true);
        this.loggingAspect.logAfterThrowing(this.proceedingJoinPoint, exception);
        verify(this.exception, times(1)).getCause();
    }

    @Test
    public void testLogAround() throws Throwable {
        assertThat(this.loggingAspect.logAround(this.proceedingJoinPoint)).isNull();
        verify(this.proceedingJoinPoint, times(1)).proceed();
    }

    @Test
    public void testLogAroundWithTrowableException() throws Throwable {
        when(this.proceedingJoinPoint.proceed()).thenThrow(this.exception);
        try {
            this.loggingAspect.logAround(this.proceedingJoinPoint);
            fail();
        } catch (Throwable throwable) {
            verify(this.proceedingJoinPoint, times(1)).proceed();
        }
    }

    @Test
    public void testLogAroundWithIllegalArgumentException() throws Throwable {
        when(this.proceedingJoinPoint.proceed()).thenThrow(new IllegalArgumentException());
        try {
            this.loggingAspect.logAround(this.proceedingJoinPoint);
            fail();
        } catch (Throwable throwable) {
            verify(this.proceedingJoinPoint, times(1)).proceed();
        }
    }
}
